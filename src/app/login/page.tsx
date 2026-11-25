import { redirect } from "next/navigation";
import { requestLoginLink } from "@/app/actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Card, Field, Notice, inputClass } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

const ERRORS: Record<string, string> = {
  expired: "That sign-in link has expired or was already used. Request a new one.",
  suspended: "This account is suspended while we review a report. Email the UniConnect team if you think this is a mistake.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser().catch(() => null)) redirect("/trips");
  const { error } = await searchParams;
  return (
    <Card className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">We&apos;ll email you a one-time link. No password needed.</p>
      {typeof error === "string" && ERRORS[error] && <Notice kind="error">{ERRORS[error]}</Notice>}
      <ActionForm action={requestLoginLink}>
        <Field label="UCR email">
          <input name="email" type="email" required autoComplete="email" placeholder="you@ucr.edu" className={inputClass} />
        </Field>
        <SubmitButton>Email me a sign-in link</SubmitButton>
      </ActionForm>
    </Card>
  );
}
