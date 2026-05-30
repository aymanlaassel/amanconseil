import type { Locale } from '@/i18n/routing';

/**
 * Labels for the Contact form, which has no equivalent in the maquette T
 * dictionary (the maquette only had contact "ways"). Kept here so the generated
 * message catalogs stay a faithful copy of the maquette.
 */
export const CONTACT_LABELS: Record<
  Locale,
  { nom: string; contact: string; contact_ph: string; message: string; message_ph: string; send: string; ok_sub: string }
> = {
  fr: {
    nom: 'Nom',
    contact: 'Téléphone ou email',
    contact_ph: '06 00 00 00 00 ou vous@email.com',
    message: 'Votre message',
    message_ph: 'Parlez-nous de votre projet…',
    send: 'Envoyer →',
    ok_sub: 'Merci. Nous revenons vers vous rapidement.',
  },
  ar: {
    nom: 'الاسم',
    contact: 'الهاتف أو البريد الإلكتروني',
    contact_ph: '06 00 00 00 00 أو you@email.com',
    message: 'رسالتك',
    message_ph: 'حدّثنا عن مشروعك…',
    send: 'إرسال ←',
    ok_sub: 'شكرًا. سنعاود الاتصال بك قريبًا.',
  },
  en: {
    nom: 'Name',
    contact: 'Phone or email',
    contact_ph: '06 00 00 00 00 or you@email.com',
    message: 'Your message',
    message_ph: 'Tell us about your project…',
    send: 'Send →',
    ok_sub: 'Thank you. We will get back to you shortly.',
  },
};

export const FORM_ERROR: Record<Locale, string> = {
  fr: 'Une erreur est survenue. Veuillez réessayer.',
  ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  en: 'Something went wrong. Please try again.',
};
