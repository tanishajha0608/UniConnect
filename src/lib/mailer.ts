import { Resend } from "resend";

type Mail = { to: string; subject: string; text: string; html?: string };

/**
 * Sends email through Resend when RESEND_API_KEY is set. Without a key (local
 * development) it logs the message so magic links can be copied from the terminal.
 */
export async function sendMail(mail: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`\n[mail:dev] to=${mail.to}\nsubject: ${mail.subject}\n${mail.text}\n`);
    return;
  }
  const resend = new Resend(key);
  const from = process.env.EMAIL_FROM ?? "UniConnect <no-reply@uniconnect.app>";
  const { error } = await resend.emails.send({ from, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html });
  if (error) throw new Error(`Email failed: ${error.message}`);
}

export function appUrl(path = ""): string {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}
