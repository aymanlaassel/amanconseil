import { Html } from './Html';

export function SectionHeader({
  tag,
  title,
  subtitle,
}: {
  tag?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="shead">
      {tag ? <Html className="tag" html={tag} /> : null}
      <Html as="h2" className="disp" html={title} />
      {subtitle ? <Html as="p" html={subtitle} /> : null}
    </div>
  );
}
