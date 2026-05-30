import type { ReactNode } from 'react';

/** Problem / target-audience card (icon + title + text) used in the .prob grid. */
export function Card({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="card">
      <div className="ic">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
