/**
 * Anti-spam honeypot field. Hidden with `display:none` so browser autofill
 * skips it (off-screen positioning gets autofilled by Chrome and produced
 * false positives), while naive bots that fill every input still trip it.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      <label htmlFor="contact-url-field">Ne pas remplir ce champ</label>
      <input
        id="contact-url-field"
        type="text"
        name="url"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
