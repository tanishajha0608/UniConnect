import { saveProfile, signOut, unblockUser } from "@/app/actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Button, Card, Field, Notice, inputClass } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { User } from "@/lib/models";

export default async function ProfilePage({ searchParams }: PageProps<"/profile">) {
  const user = await requireUser({ allowIncompleteProfile: true });
  const { welcome } = await searchParams;
  const blocked = await User.find({ _id: { $in: user.blocked ?? [] } }, { name: 1 }).lean();
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-xl font-semibold">Your profile</h1>
        {welcome && !user.name && <Notice kind="ok">You&apos;re verified as {user.email}. Add your name to start posting trips.</Notice>}
        <ActionForm action={saveProfile}>
          <Field label="Full name" hint="Others see your first name and last initial until you're matched.">
            <input name="name" required defaultValue={user.name ?? ""} className={inputClass} />
          </Field>
          <Field label="Venmo handle (optional)" hint="So riders can pay you back if you book the ride.">
            <input name="venmo" defaultValue={user.venmo ?? ""} placeholder="@your-handle" className={inputClass} />
          </Field>
          <SubmitButton>Save</SubmitButton>
        </ActionForm>
        <p className="text-xs text-slate-500">Signed in as {user.email}</p>
      </Card>

      {blocked.length > 0 && (
        <Card className="space-y-2">
          <h2 className="font-semibold">Blocked</h2>
          {blocked.map((b) => (
            <form key={String(b._id)} action={unblockUser} className="flex items-center justify-between">
              <span className="text-sm">{b.name ?? "UCR student"}</span>
              <input type="hidden" name="userId" value={String(b._id)} />
              <Button variant="secondary">Unblock</Button>
            </form>
          ))}
        </Card>
      )}

      <form action={signOut}>
        <Button variant="secondary">Sign out</Button>
      </form>
    </div>
  );
}
