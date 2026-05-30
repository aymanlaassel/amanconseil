// Minimal hand-written DB types mirroring supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once the project is linked.

export type LeadStatus = 'nouveau' | 'contacte' | 'rdv' | 'client' | 'perdu';
export type Verdict = 'vert' | 'orange' | 'rouge';
export type Metier =
  | 'notaire'
  | 'architecte'
  | 'geometre'
  | 'bet'
  | 'btp'
  | 'geotechnique'
  | 'juriste'
  | 'comptable'
  | 'banquier'
  | 'autre';

export type ScoreJson = {
  ok: number;
  warn: number;
  bad: number;
  blockingBad: number;
};

export type Lead = {
  id: string;
  nom: string;
  telephone: string;
  email: string | null;
  source: string | null;
  locale: string;
  statut: LeadStatus;
  consent_at: string | null;
  created_at: string;
};

export type Prediagnostic = {
  id: string;
  lead_id: string;
  reponses: unknown;
  score: ScoreJson;
  verdict: Verdict;
  created_at: string;
};

export type MessageContact = {
  id: string;
  nom: string;
  contact: string;
  message: string | null;
  locale: string;
  consent_at: string | null;
  created_at: string;
};

export type Prestataire = {
  id: string;
  nom: string;
  metier: Metier;
  ville: string | null;
  telephone: string;
  email: string | null;
  message: string | null;
  locale: string;
  consent_at: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      leads: { Row: Lead; Insert: Partial<Lead> & Pick<Lead, 'nom' | 'telephone'>; Update: Partial<Lead> };
      prediagnostics: {
        Row: Prediagnostic;
        Insert: Omit<Prediagnostic, 'id' | 'created_at'>;
        Update: Partial<Prediagnostic>;
      };
      messages_contact: {
        Row: MessageContact;
        Insert: Partial<MessageContact> & Pick<MessageContact, 'nom' | 'contact'>;
        Update: Partial<MessageContact>;
      };
      prestataires: {
        Row: Prestataire;
        Insert: Partial<Prestataire> & Pick<Prestataire, 'nom' | 'metier' | 'telephone'>;
        Update: Partial<Prestataire>;
      };
    };
  };
};
