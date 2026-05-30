import type { ElementType } from 'react';

/**
 * Renders a localized string that may contain inline markup (the maquette copy
 * uses <span>, <b>, <li>, <br>…). The content comes from our own message
 * catalogs — never from user input — so injecting it as HTML is safe here.
 */
export function Html({
  as: Tag = 'span',
  html,
  className,
}: {
  as?: ElementType;
  html: string;
  className?: string;
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
