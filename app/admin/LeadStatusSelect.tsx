'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateLeadStatus } from './actions';

const STATUSES = ['nouveau', 'contacte', 'rdv', 'client', 'perdu'] as const;

export function LeadStatusSelect({ id, value }: { id: string; value: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value;
        startTransition(async () => {
          await updateLeadStatus(id, v);
          router.refresh();
        });
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
