import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Chunk {
  id: string;
  source: string;
  text: string;
  embedding: number[];
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenerativeAI(apiKey);

    // 1. Generate query embedding
    const embedModel = ai.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embResponse = await embedModel.embedContent(message);
    const queryEmbedding = embResponse.embedding?.values;
    if (!queryEmbedding) {
      return NextResponse.json({ error: 'Failed to embed query' }, { status: 500 });
    }

    // 2. Load vectors from public/vectors.json
    const vectorsPath = path.join(process.cwd(), 'public', 'vectors.json');
    if (!fs.existsSync(vectorsPath)) {
      return NextResponse.json({ error: 'Vector store not found. Run ingestion script.' }, { status: 500 });
    }

    const chunks: Chunk[] = JSON.parse(fs.readFileSync(vectorsPath, 'utf-8'));
    const scored = chunks.map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);
    const topContexts = scored.slice(0, 3);

    const contextString = topContexts.map(c => `\n${c.text}`).join('\n\n');

    // 3. System prompt with Grounded Refusal constraint
    const systemPrompt = `You are an AI assistant representing Humza Ansari on Humza's personal portfolio website. 
Answer questions strictly using the provided context below. 
If the answer cannot be found in the context (such as work experience at companies not mentioned like Google, Meta, etc.), politely decline and state that you do not have that experience or information. Do not invent or hallucinate facts.

Context:
${contextString}`;

    const promptText = systemPrompt + '\n\nUser Question: ' + message;

    // 4. Generate answer using gemini-3.5-flash-lite
    let reply = "";
    try {
      const chatModel = ai.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const result = await chatModel.generateContent(promptText);
      const response = await result.response;
      reply = response.text();
    } catch (modelErr) {
      // Fallback if needed
      const fallbackModel = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await fallbackModel.generateContent(promptText);
      const response = await result.response;
      reply = response.text();
    }

    if (!reply) {
      reply = "I'm sorry, I couldn't generate a response.";
    }

    return NextResponse.json({ reply, sources: topContexts.map(c => c.source) });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}