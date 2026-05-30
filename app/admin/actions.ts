'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdminUser, getSupabaseAuth } from '@/lib/supabase/auth';
import { getServiceClient } from '@/lib/supabase/server';
import type { LeadStatus } from '@/lib/supabase/types';

const STATUSES: LeadStatus[] = ['nouveau', 'contacte', 'rdv', 'client', 'perdu'];

export async function updateLeadStatus(id: string, statut: string): Promise<void> {
  const admin = await getAdminUser();
  if (admin.state !== 'ok') return;
  if (!STATUSES.includes(statut as LeadStatus)) return;

  const supabase = getServiceClient();
  await supabase.from('leads').update({ statut: statut as LeadStatus }).eq('id', id);
  revalidatePath('/admin');
}

export async function signOut(): Promise<void> {
  const sb = await getSupabaseAuth();
  if (sb) await sb.auth.signOut();
  redirect('/admin/login');
}
