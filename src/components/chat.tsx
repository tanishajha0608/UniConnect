"use client";

import { useEffect, useRef, useState } from "react";
import { postMessage } from "@/app/actions";
import { inputClass } from "./ui";

type Msg = { id: string; mine: boolean; name: string; body: string; at: string };

async function fetchMessages(rideId: string): Promise<Msg[] | null> {
  const res = await fetch(`/api/rides/${rideId}/messages`, { cache: "no-store" });
  return res.ok ? (await res.json()).messages : null;
}

/** Ride chat. Polls every 5 seconds, which is plenty for coordinating a pickup and needs no websocket service. */
export function Chat({ rideId }: { rideId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const next = await fetchMessages(rideId);
      if (alive && next) setMessages(next);
    };
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 5000);
    return () => {
      alive = false;
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [rideId]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  async function send(form: FormData) {
    if (!text.trim()) return;
    setText("");
    await postMessage(form);
    const next = await fetchMessages(rideId);
    if (next) setMessages(next);
  }

  return (
    <div className="space-y-3">
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
        {messages.length === 0 && <p className="text-sm text-slate-500">Say hi and agree on a pickup spot and time.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.mine ? "bg-blue-700 text-white" : "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"}`}>
              {!m.mine && <p className="text-xs font-semibold opacity-70">{m.name}</p>}
              <p className="whitespace-pre-wrap break-words">{m.body}</p>
            </div>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <form action={send} className="flex gap-2">
        <input type="hidden" name="rideId" value={rideId} />
        <input name="body" value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} placeholder="Message your ride group" className={inputClass} aria-label="Message" />
        <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Send</button>
      </form>
    </div>
  );
}
