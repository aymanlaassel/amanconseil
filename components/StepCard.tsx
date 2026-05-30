export function StepCard({
  num,
  title,
  text,
  highlight,
}: {
  num: string;
  title: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div className="step" style={highlight ? { background: 'var(--accent)', color: '#04342C' } : undefined}>
      <span className="num" style={highlight ? { color: '#04342C' } : undefined}>
        {num}
      </span>
      <h4 style={highlight ? { color: '#04342C' } : undefined}>{title}</h4>
      <p style={highlight ? { color: '#0B5C44' } : undefined}>{text}</p>
    </div>
  );
}
