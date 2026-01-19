import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function POST(req: Request) {
  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const vecPath = path.join(process.cwd(), "data", "kb_vectors.json");
  if (!fs.existsSync(vecPath)) {
    return NextResponse.json(
      { error: "kb_vectors.json not found. Run: node scripts/build_kb.mjs" },
      { status: 500 }
    );
  }

  const raw = fs.readFileSync(vecPath, "utf8");
  const { records } = JSON.parse(raw);

  const qEmb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: message,
  });
  const q = qEmb.data[0].embedding as number[];

  const scored = records
    .map((r: any) => ({ ...r, score: cosineSimilarity(q, r.embedding as number[]) }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 3);

  const context = scored
    .map((r: any) => `SOURCE: ${r.source}\nCHUNK:\n${r.text}`)
    .join("\n\n---\n\n");

  const system =
    "You are a helpful assistant. Use ONLY the provided CONTEXT to answer. " +
    "If the CONTEXT does not contain the answer, say what is missing and ask a clarifying question. " +
    "Do not invent policies or facts. Keep answers concise and practical.";

  const user = `CONTEXT\n${context}\n\nUSER QUESTION\n${message}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
  });

  const answer = completion.choices[0]?.message?.content ?? "";

  return NextResponse.json({
    answer,
    sources: scored.map((r: any) => ({ id: r.id, source: r.source, score: r.score })),
  });
}