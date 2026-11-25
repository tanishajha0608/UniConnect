import { createTrip } from "@/app/actions";
import { ActionForm, SubmitButton } from "@/components/forms";
import { Card, Field, inputClass } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { PLACES, PLACE_GROUPS } from "@/lib/places";

function PlaceSelect({ name, defaultValue }: { name: string; defaultValue: string }) {
  return (
    <select name={name} defaultValue={defaultValue} required className={inputClass}>
      {PLACE_GROUPS.map((g) => (
        <optgroup key={g} label={g}>
          {PLACES.filter((p) => p.group === g).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export default async function NewTripPage() {
  await requireUser();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  return (
    <Card className="space-y-4">
      <h1 className="text-xl font-semibold">Post a trip</h1>
      <ActionForm action={createTrip}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Leaving from"><PlaceSelect name="origin" defaultValue="ucr-bell-tower" /></Field>
          <Field label="Going to"><PlaceSelect name="destination" defaultValue="ont" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date"><input type="date" name="date" min={today} defaultValue={today} required className={inputClass} /></Field>
          <Field label="Earliest leave time"><input type="time" name="from" required defaultValue="09:00" className={inputClass} /></Field>
          <Field label="Latest leave time" hint="A wider window finds more matches."><input type="time" name="to" required defaultValue="11:00" className={inputClass} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="People in your group">
            <select name="riders" defaultValue="1" className={inputClass}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 1 ? "Just me" : `${n} people`}</option>)}
            </select>
          </Field>
          <Field label="Luggage">
            <select name="luggage" defaultValue="none" className={inputClass}>
              <option value="none">None or a backpack</option>
              <option value="carry-on">Carry-on</option>
              <option value="checked">Checked bag</option>
            </select>
          </Field>
        </div>
        <Field label="Note (optional)" hint="For example your flight time or terminal. Don't include your room number.">
          <textarea name="note" maxLength={280} rows={2} className={inputClass} />
        </Field>
        <SubmitButton>Post and find matches</SubmitButton>
      </ActionForm>
    </Card>
  );
}
