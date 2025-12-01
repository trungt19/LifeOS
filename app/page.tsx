"use client";
import { useEffect, useMemo, useState } from "react";

type Mood = "Great" | "Good" | "Okay" | "Low" | "Exhausted";

type CheckIn = {
  id: string;
  createdAt: string;
  mood: Mood;
  entry: string;
  summary: string;
};

const MOOD_OPTIONS: Mood[] = ["Great", "Good", "Okay", "Low", "Exhausted"];

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("Okay");
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("checkIns");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CheckIn[];
        setCheckIns(parsed);
      } catch (err) {
        console.error("Failed to parse saved check-ins", err);
      }
    }
  }, []);

  useEffect(() => {
    if (checkIns.length) {
      localStorage.setItem("checkIns", JSON.stringify(checkIns));
    }
  }, [checkIns]);

  const latestCheckIn = useMemo(() => checkIns[0], [checkIns]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError("Please share a few thoughts before checking in.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      const aiSummary = data.summary || "Unable to generate summary.";
      setSummary(aiSummary);

      const newCheckIn: CheckIn = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        mood,
        entry: text,
        summary: aiSummary,
      };

      setCheckIns((prev) => [newCheckIn, ...prev]);
      setText("");
    } catch (err) {
      console.error(err);
      setError("We couldn't complete your check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 sm:p-8 bg-gray-50">
      <div className="w-full max-w-5xl grid lg:grid-cols-[2fr,1.2fr] gap-6 lg:gap-10">
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Daily ritual</p>
              <h1 className="text-3xl font-bold text-blue-600">Check In</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current mood</p>
              <p className="text-lg font-semibold text-gray-800">{mood}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                How are you feeling today?
              </p>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMood(option)}
                    className={`rounded-full px-3 py-1 text-sm border transition ${
                      mood === option
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capture your thoughts
              </label>
              <textarea
                className="w-full border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition rounded p-3 text-gray-800"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Reflect on your day, name a win, or vent about a challenge."
              />
            </div>

            {error && (
              <div className="rounded bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Checking in..." : "Complete check-in"}
            </button>
          </form>

          {summary && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h2 className="text-lg font-semibold text-gray-900">AI reflection</h2>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{summary}</p>
            </div>
          )}
        </section>

        <section className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent check-ins</h2>
            <span className="text-sm text-gray-500">{checkIns.length} saved</span>
          </div>

          {latestCheckIn ? (
            <div className="space-y-3">
              <div className="rounded border border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(latestCheckIn.createdAt).toLocaleString()}</span>
                  <span className="font-medium text-blue-700">{latestCheckIn.mood}</span>
                </div>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                  {latestCheckIn.summary}
                </p>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {checkIns.slice(1).map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="border border-gray-100 rounded p-3 hover:border-blue-200 transition"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(checkIn.createdAt).toLocaleString()}</span>
                      <span className="font-semibold text-gray-700">{checkIn.mood}</span>
                    </div>
                    <p className="mt-1 text-gray-800 text-sm max-h-20 overflow-hidden text-ellipsis">
                      {checkIn.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-600 text-sm">
              No check-ins yet. Complete your first reflection to start a streak.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
