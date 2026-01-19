"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };
type Source = { id: string; source: string; score: number };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);

  async function send() {
    if (!input.trim() || loading) return;

    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
      setSources(data.sources || []);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Simple Demo Chat Bot (RAG)</h1>
      <p style={{ opacity: 0.8 }}>
        Answers are grounded in local docs in <code>kb/</code>. Top retrieved sources are shown below.
      </p>

      <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, minHeight: 280 }}>
        {messages.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Try: “What are the rules for handling PII?”</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ margin: "10px 0" }}>
              <div style={{ fontWeight: 700 }}>{m.role === "user" ? "You" : "Assistant"}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Type a question..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Sources (Top Retrieved Chunks)</h2>
        {sources.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No sources yet.</p>
        ) : (
          <ul>
            {sources.map((s) => (
              <li key={s.id}>
                <code>{s.source}</code> — score: {s.score.toFixed(3)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
