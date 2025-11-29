"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Daily Check-In</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-lg shadow"
      >
        <label className="block mb-2 font-medium">
          How are you feeling today?
        </label>

        <textarea
          className="w-full border p-3 rounded mb-4"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write anything on your mind..."
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </form>

      {summary && (
        <div className="mt-8 w-full max-w-xl bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Your AI Summary</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </main>
  );
}
