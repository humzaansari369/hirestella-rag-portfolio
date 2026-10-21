# HireStella AI Developer - Talk to Me RAG Portfolio

Document-grounded RAG portfolio built for the HireStella AI Developer assessment by **Humza Ansari**.

## 🚀 Live Demo & Links
- **Live Website:** [https://hirestella-rag-portfolio.vercel.app](https://hirestella-rag-portfolio.vercel.app)
- **GitHub Repository:** [https://github.com/humzaansari369/hirestella-rag-portfolio](https://github.com/humzaansari369/hirestella-rag-portfolio)

---

## 🛠️ Key Technical Features
1. **Document-Grounded RAG Pipeline:** Ingests and chunks markdown documents (`cv.md`, `project-1.md`, `project-2.md`, `faq.md`), generating vector embeddings via Google Gemini (`gemini-embedding-001`).

2. **Semantic Similarity Search:** Computes cosine similarity between user query vectors and stored vector chunks (`public/vectors.json`) to retrieve top-3 relevant contexts.

3. **Strict Grounded Refusal:** Enforces robust system prompt constraints to prevent hallucinations and politely decline queries about unlisted experiences (e.g., denying prior work at Google or Meta).

4. **Modern Responsive UI:** Clean Next.js App Router design styled with Tailwind CSS, featuring an interactive bottom-right chat widget ("Talk to Humza").

---

## 💻 Tech Stack
- **Framework:** Next.js (App Router, TypeScript/JavaScript)
- **Styling:** Tailwind CSS
- **AI / Embeddings:** Google Generative AI SDK (`gemini-embedding-001`, `gemini-3.5-flash-lite`)
- **Vector Index:** Lightweight static JSON store (`public/vectors.json`)
- **Deployment:** Vercel

---

## ⚙️ Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/humzaansari369/hirestella-rag-portfolio.git](https://github.com/humzaansari369/hirestella-rag-portfolio.git)
   cd hirestella-rag-portfolio
