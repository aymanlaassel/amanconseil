/**
 * Placeholder root home for the Part 1 scaffold.
 * Part 2 replaces this with locale-prefixed routing (`/[locale]`) via next-intl
 * and a middleware redirect from `/` to the negotiated locale.
 */
export default function ScaffoldHome() {
  return (
    <main className="hero">
      <div className="grid-bg" />
      <div className="blob" />
      <div className="wrap" style={{ position: 'relative', padding: '120px 22px' }}>
        <span className="tag">Aman Conseil · Phase 1</span>
        <h1 className="disp" style={{ marginTop: 16 }}>
          aman<span className="g">.</span>conseil
        </h1>
        <p className="sub">
          Sécurisez votre projet immobilier. Évitez les arnaques. — scaffold en place,
          construction en cours.
        </p>
      </div>
    </main>
  );
}
