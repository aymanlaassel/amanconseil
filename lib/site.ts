/** Site-wide constants (safe to use on client; only public env vars). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.amanconseil.ma';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '212600000000';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_EMAIL = 'contact@amanconseil.ma';
