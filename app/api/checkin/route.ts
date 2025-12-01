import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { mood, sleepHours, energy, notes } = body;

    const prompt = `
You are an AI health coach analyzing a daily check-in.
Here is the user's data:

Mood: ${mood}/10
Sleep Hours: ${sleepHours}
Energy Level: ${energy}/10
Notes: ${notes}

Give a short, supportive summary AND 3 recommendations.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", 
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });

  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: "AI request failed." }, { status: 500 });
  }
}
