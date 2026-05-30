import { z } from 'zod';

export const LOCALES = ['fr', 'ar', 'en'] as const;

export const METIERS = [
  'notaire',
  'architecte',
  'geometre',
  'bet',
  'btp',
  'geotechnique',
  'juriste',
  'comptable',
  'banquier',
  'autre',
] as const;

/** Strip spaces, dots, dashes and parentheses from a phone number. */
export function normalizePhone(value: string): string {
  return value.replace(/[\s().-]/g, '').trim();
}

const localeField = z.enum(LOCALES).default('fr');
const consentField = z.literal(true, { message: 'Consent is required.' });
const honeypotField = z.string().optional().default('');
const turnstileField = z.string().optional().default('');

const phoneField = z
  .string()
  .trim()
  .min(6, { message: 'Phone number is too short.' })
  .transform(normalizePhone)
  .refine((v) => /^\+?\d{6,15}$/.test(v), { message: 'Invalid phone number.' });

const nameField = z.string().trim().min(2, { message: 'Name is required.' }).max(120);
const optionalEmail = z
  .union([z.string().trim().email(), z.literal('')])
  .optional()
  .transform((v) => (v ? v : undefined));

// --- Pre-diagnosis ---------------------------------------------------------
// `answers` is the selected option index per question, in order.
export const prediagnosticSchema = z.object({
  nom: nameField,
  telephone: phoneField,
  email: optionalEmail,
  consent: consentField,
  locale: localeField,
  answers: z.array(z.number().int().min(0)).min(1, { message: 'Answers are required.' }),
  honeypot: honeypotField,
  turnstileToken: turnstileField,
});
export type PrediagnosticInput = z.infer<typeof prediagnosticSchema>;

// --- Contact ---------------------------------------------------------------
export const contactSchema = z.object({
  nom: nameField,
  contact: z.string().trim().min(3, { message: 'A contact is required.' }).max(160),
  message: z.string().trim().max(2000).optional(),
  consent: consentField,
  locale: localeField,
  honeypot: honeypotField,
  turnstileToken: turnstileField,
});
export type ContactInput = z.infer<typeof contactSchema>;

// --- Provider application --------------------------------------------------
export const providerSchema = z.object({
  nom: nameField,
  metier: z.enum(METIERS),
  ville: z.string().trim().max(120).optional(),
  telephone: phoneField,
  email: optionalEmail,
  message: z.string().trim().max(2000).optional(),
  consent: consentField,
  locale: localeField,
  honeypot: honeypotField,
  turnstileToken: turnstileField,
});
export type ProviderInput = z.infer<typeof providerSchema>;
