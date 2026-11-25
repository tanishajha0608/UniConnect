"use client";

import { useState } from "react";
import { reportUser } from "@/app/actions";
import { ActionForm, SubmitButton } from "./forms";
import { inputClass } from "./ui";

export function ReportForm({ userId, rideId, name }: { userId: string; rideId: string; name: string }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-red-700 underline dark:text-red-300">
        Report
      </button>
    );
  return (
    <ActionForm action={reportUser} className="mt-2 w-full space-y-2">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="rideId" value={rideId} />
      <textarea name="reason" required minLength={5} rows={2} placeholder={`What happened with ${name}?`} className={inputClass} />
      <SubmitButton variant="danger">Send report</SubmitButton>
    </ActionForm>
  );
}
