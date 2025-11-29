import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ summary: "No input provided." });
    }

    // Call OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OpenAI API key");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You summarize journal entries into a friendly, motivational reflection.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await res.json();
    const aiText =
      data.choices?.[0]?.message?.content || "Unable to generate summary.";

    return NextResponse.json({ summary: aiText });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { summary: "Server error. Try again later." },
      { status: 500 }
    );
  }
}
