<<<<<<< HEAD
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sleep, mood, weight, goals } = body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
      The user slept ${sleep} hours,
      rated their mood as ${mood}/10,
      weighed ${weight} lbs,
      and set these goals for today:

      "${goals}"

      Please return:
      - A short daily wellness summary (2–3 sentences)
      - 3 action steps for tomorrow
      - A 1–10 wellness score for today
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const output = response.choices[0].message.content;

    return new Response(JSON.stringify({ summary: output }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
=======
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Summarize this: ${text}`,
        },
      ],
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "API request failed" },
      { status: 500 }
    );
>>>>>>> d551ddf (add API route)
  }
}
