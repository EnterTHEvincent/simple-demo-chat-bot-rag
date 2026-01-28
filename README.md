# Simple Demo Chat Bot (RAG)

A Next.js-based Retrieval-Augmented Generation (RAG) chatbot that answers questions using a local knowledge base. The chatbot uses OpenAI embeddings for semantic search and GPT-4o-mini for generating contextually grounded responses.

## Features

- 🤖 **RAG-powered chatbot** - Answers questions using context from local knowledge base documents
- 🔍 **Semantic search** - Uses OpenAI embeddings and cosine similarity to find relevant document chunks
- 📚 **Local knowledge base** - Stores documents in `kb/` directory (Markdown/TXT files)
- 🎯 **Source attribution** - Shows which documents and chunks were used to generate each answer
- ⚡ **Fast retrieval** - Pre-computed embeddings stored in JSON for quick similarity search

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd simple-demo-chat-bot-rag
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Building the Knowledge Base

Before running the chatbot, you need to build the vector embeddings from your knowledge base documents:

```bash
node scripts/build_kb.mjs
```

This script will:
- Read all `.md` and `.txt` files from the `kb/` directory
- Chunk the text (800 characters per chunk with 120 character overlap)
- Generate embeddings using OpenAI's `text-embedding-3-small` model
- Save the embeddings to `data/kb_vectors.json`

**Note:** You must run this script whenever you update files in the `kb/` directory.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Start chatting! Try asking questions like:
   - "What are the rules for handling PII?"
   - Or any question related to your knowledge base content

## Project Structure

```
simple-demo-chat-bot-rag/
├── kb/                    # Knowledge base documents (Markdown/TXT files)
│   ├── faq.md
│   ├── intake_template.md
│   └── security.md
├── data/                  # Generated vector embeddings
│   └── kb_vectors.json
├── scripts/
│   └── build_kb.mjs      # Script to build knowledge base embeddings
├── src/
│   └── app/
│       ├── api/
│       │   └── chat/
│       │       └── route.ts    # API endpoint for chat
│       └── page.tsx             # Chat UI
└── package.json
```

## How It Works

1. **Question Processing**: When a user asks a question, the system:
   - Generates an embedding for the question using OpenAI's `text-embedding-3-small` model

2. **Retrieval**: 
   - Computes cosine similarity between the question embedding and all document chunk embeddings
   - Retrieves the top 3 most relevant chunks

3. **Generation**:
   - Constructs a context from the retrieved chunks
   - Sends the context and question to GPT-4o-mini with instructions to answer only from the provided context
   - Returns the answer along with source attribution

4. **Display**:
   - Shows the answer in the chat interface
   - Displays the top retrieved sources with their similarity scores

## Technologies Used

- **Next.js 16** - React framework with App Router
- **OpenAI API** - For embeddings (`text-embedding-3-small`) and chat completions (`gpt-4o-mini`)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Adding New Documents

1. Add your Markdown or text files to the `kb/` directory
2. Run `node scripts/build_kb.mjs` to regenerate embeddings
3. The new content will be available in the chatbot

## License

This project is private and not licensed for public use.
