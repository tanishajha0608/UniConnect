"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/actions";
import { Button, Notice } from "./ui";

export function SubmitButton({ children, variant }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant={variant}>
      {pending ? "Working…" : children}
    </Button>
  );
}

/** A form bound to a server action that returns FormState, showing its error or success message. */
export function ActionForm({
  action,
  children,
  className = "space-y-4",
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className}>
      {children}
      {state?.error && <Notice kind="error">{state.error}</Notice>}
      {state?.ok && <Notice kind="ok">{state.ok}</Notice>}
      {state?.devLink && (
        <p className="text-xs text-slate-500">
          Dev mode, no email key set: <a className="text-blue-700 underline" href={state.devLink}>open sign-in link</a>
        </p>
      )}
    </form>
  );
}
