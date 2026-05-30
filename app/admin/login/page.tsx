'use client';

import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/browser';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const sb = getBrowserClient();
    if (!sb) {
      setErr('Supabase n’est pas configuré (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).');
      setBusy(false);
      return;
    }
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/auth/callback` },
    });
    if (error) setErr(error.message);
    else setSent(true);
    setBusy(false);
  }

  return (
    <>
      <div className="abar">
        <span className="brand">
          aman<span className="c">.</span>conseil · admin
        </span>
      </div>
      <div className="awrap">
        <h1>Connexion</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Lien magique réservé aux administrateurs.
        </p>
        <div className="card">
          {sent ? (
            <p>
              ✓ Lien envoyé à <b>{email}</b>. Vérifiez votre boîte mail.
            </p>
          ) : (
            <form onSubmit={send}>
              <label htmlFor="email" className="muted">
                Email administrateur
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@amanconseil.ma"
              />
              <button className="btn-admin" type="submit" disabled={busy}>
                {busy ? '…' : 'Recevoir le lien'}
              </button>
              {err && (
                <p className="muted" style={{ color: 'var(--rouge)', marginTop: 12 }}>
                  {err}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
