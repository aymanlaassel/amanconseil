import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/auth';
import { getServiceClient } from '@/lib/supabase/server';
import { signOut } from './actions';
import { LeadStatusSelect } from './LeadStatusSelect';
import type { LeadStatus, Verdict } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

const STATUSES: LeadStatus[] = ['nouveau', 'contacte', 'rdv', 'client', 'perdu'];

function fmt(ts: string): string {
  try {
    return new Intl.DateTimeFormat('fr-MA', { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(ts),
    );
  } catch {
    return ts;
  }
}

function Bar({ email }: { email: string }) {
  return (
    <div className="abar">
      <span className="brand">
        aman<span className="c">.</span>conseil · admin
      </span>
      <form action={signOut}>
        <span className="muted" style={{ color: '#9aa1a8', marginRight: 12, fontSize: 12 }}>
          {email}
        </span>
        <button className="logout" type="submit">
          Déconnexion
        </button>
      </form>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const admin = await getAdminUser();

  if (admin.state === 'anonymous') redirect('/admin/login');

  if (admin.state === 'unconfigured') {
    return (
      <>
        <div className="abar">
          <span className="brand">
            aman<span className="c">.</span>conseil · admin
          </span>
        </div>
        <div className="awrap">
          <h1>Back-office</h1>
          <p className="muted">
            Supabase n’est pas configuré. Renseignez NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY et ADMIN_ALLOWED_EMAILS.
          </p>
        </div>
      </>
    );
  }

  if (admin.state === 'forbidden') {
    return (
      <>
        <Bar email={admin.email} />
        <div className="awrap">
          <h1>Accès refusé</h1>
          <p className="muted">{admin.email} n’est pas dans la liste des administrateurs.</p>
        </div>
      </>
    );
  }

  const { statut } = await searchParams;
  const activeFilter = STATUSES.includes(statut as LeadStatus) ? (statut as LeadStatus) : undefined;

  let content;
  try {
    const supabase = getServiceClient();

    let leadsQuery = supabase
      .from('leads')
      .select('id, nom, telephone, email, source, locale, statut, created_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (activeFilter) leadsQuery = leadsQuery.eq('statut', activeFilter);

    const [{ data: leads }, { data: prediags }, { data: contacts }, { data: providers }] =
      await Promise.all([
        leadsQuery,
        supabase.from('prediagnostics').select('lead_id, verdict, created_at'),
        supabase
          .from('messages_contact')
          .select('id, nom, contact, message, locale, created_at')
          .order('created_at', { ascending: false })
          .limit(200),
        supabase
          .from('prestataires')
          .select('id, nom, metier, ville, telephone, email, locale, created_at')
          .order('created_at', { ascending: false })
          .limit(200),
      ]);

    const verdictByLead = new Map<string, Verdict>();
    for (const p of prediags ?? []) {
      if (p.lead_id && !verdictByLead.has(p.lead_id)) verdictByLead.set(p.lead_id, p.verdict);
    }

    content = (
      <>
        <h1>Leads</h1>
        <p className="muted">{leads?.length ?? 0} lead(s)</p>

        <div className="filters">
          <a href="/admin" className={!activeFilter ? 'on' : undefined}>
            tous
          </a>
          {STATUSES.map((s) => (
            <a key={s} href={`/admin?statut=${s}`} className={activeFilter === s ? 'on' : undefined}>
              {s}
            </a>
          ))}
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Source</th>
              <th>Verdict</th>
              <th>Langue</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((l) => {
              const v = verdictByLead.get(l.id);
              return (
                <tr key={l.id}>
                  <td>{fmt(l.created_at)}</td>
                  <td>{l.nom}</td>
                  <td>{l.telephone}</td>
                  <td>{l.email ?? '—'}</td>
                  <td>{l.source ?? '—'}</td>
                  <td>{v ? <span className={`pill v-${v}`}>{v}</span> : '—'}</td>
                  <td>{l.locale}</td>
                  <td>
                    <LeadStatusSelect id={l.id} value={l.statut} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2>Messages de contact</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Contact</th>
              <th>Message</th>
              <th>Langue</th>
            </tr>
          </thead>
          <tbody>
            {(contacts ?? []).map((c) => (
              <tr key={c.id}>
                <td>{fmt(c.created_at)}</td>
                <td>{c.nom}</td>
                <td>{c.contact}</td>
                <td>{c.message ?? '—'}</td>
                <td>{c.locale}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Candidatures prestataires</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Métier</th>
              <th>Ville</th>
              <th>Téléphone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {(providers ?? []).map((p) => (
              <tr key={p.id}>
                <td>{fmt(p.created_at)}</td>
                <td>{p.nom}</td>
                <td>{p.metier}</td>
                <td>{p.ville ?? '—'}</td>
                <td>{p.telephone}</td>
                <td>{p.email ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  } catch (err) {
    console.error('[admin] load failed:', err);
    content = (
      <>
        <h1>Back-office</h1>
        <p className="muted" style={{ color: 'var(--rouge)' }}>
          Échec du chargement des données. Vérifiez SUPABASE_SERVICE_ROLE_KEY.
        </p>
      </>
    );
  }

  return (
    <>
      <Bar email={admin.email} />
      <div className="awrap">{content}</div>
    </>
  );
}
