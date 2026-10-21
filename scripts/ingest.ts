import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in .env.local");
  process.exit(1);
}

const ai = new GoogleGenerativeAI(apiKey);

interface Chunk {
  id: string;
  source: string;
  text: string;
  embedding: number[];
}

async function generateEmbedding(text: string): Promise<number[]> {
  // Updated embedding model name
  const model = ai.getGenerativeModel({ model: 'gemini-embedding-001' });
  const response = await model.embedContent(text);
  if (!response.embedding?.values) {
    throw new Error('Failed to generate embedding');
  }
  return response.embedding.values;
}

async function main() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    console.error("❌ 'data' folder not found!");
    process.exit(1);
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));
  const chunks: Chunk[] = [];
  let idCounter = 1;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const sections = content.split(/\n\n+/);
    for (const section of sections) {
      const trimmed = section.trim();
      if (trimmed.length > 20) {
        console.log(`Embedding chunk from ${file}...`);
        const embedding = await generateEmbedding(trimmed);
        chunks.push({
          id: `chunk_${idCounter++}`,
          source: file,
          text: trimmed,
          embedding,
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  const outputPath = path.join(process.cwd(), 'public', 'vectors.json');
  fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2));
  console.log(`✅ Successfully ingested ${chunks.length} chunks into public/vectors.json`);
}

main().catch(console.error);