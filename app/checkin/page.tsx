"use client";

import { useState } from "react";

export default function CheckInPage() {
  const [mood, setMood] = useState(5);
  const [sleepHours, setSleepHours] = useState("");
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse("");

    const payload = {
      mood,
      sleepHours,
      energy,
      notes,
    };

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.summary) {
        setAiResponse(data.summary);
      } else {
        setAiResponse("Something went wrong — no summary returned.");
      }

    } catch (err) {
      console.error(err);
      setAiResponse("Error connecting to the AI backend.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Check-In</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow"
      >

        {/* Mood */}
        <div>
          <label className="block font-medium mb-2">
            Mood Level: {mood}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Sleep */}
        <div>
          <label className="block font-medium mb-2">Hours of Sleep</label>
          <input
            type="number"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            placeholder="e.g. 7.5"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Energy */}
        <div>
          <label className="block font-medium mb-2">
            Energy Level: {energy}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How do you feel today?"
            className="w-full border p-2 rounded h-24"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800"
        >
          {loading ? "Submitting..." : "Submit Check-In"}
        </button>
      </form>

      {/* AI Response */}
      {aiResponse && (
        <div className="mt-6 p-4 bg-neutral-100 rounded-xl border">
          <h2 className="font-bold mb-2">AI Summary</h2>
          <p className="whitespace-pre-line">{aiResponse}</p>
        </div>
      )}
    </div>
  );
}
