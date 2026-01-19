import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function chunkText(text, chunkSize = 800, overlap = 120) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks.map((c) => c.trim()).filter(Boolean);
}

async function main() {
  const kbDir = path.join(process.cwd(), "kb");
  const dataDir = path.join(process.cwd(), "data");
  const outPath = path.join(dataDir, "kb_vectors.json");

  const files = fs.readdirSync(kbDir).filter((f) => f.endsWith(".md") || f.endsWith(".txt"));

  const records = [];
  for (const file of files) {
    const full = fs.readFileSync(path.join(kbDir, file), "utf8");
    const chunks = chunkText(full);

    for (let idx = 0; idx < chunks.length; idx++) {
      const text = chunks[idx];
      const emb = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      records.push({
        id: `${file}::${idx}`,
        source: file,
        text,
        embedding: emb.data[0].embedding,
      });
    }
  }

  fs.writeFileSync(outPath, JSON.stringify({ createdAt: new Date().toISOString(), records }, null, 2));
  console.log(`Wrote ${records.length} chunks to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});