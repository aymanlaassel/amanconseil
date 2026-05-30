import { getTranslations } from 'next-intl/server';
import { Html } from './Html';
import { Button } from './Button';

type Tier = {
  prefix: string; // message-key prefix
  highlight?: boolean;
  priceKey: string;
  ctaDark?: boolean;
};

// The 5 AMO levels (last one highlighted). Keys ported from the maquette.
const TIERS: Tier[] = [
  { prefix: 'n1', priceKey: 'n1_price' },
  { prefix: 'n2', priceKey: 'n2_price' },
  { prefix: 'tier1', priceKey: 'tier_price' },
  { prefix: 'tier2', priceKey: 'tier_price' },
  { prefix: 'tier3', priceKey: 'tier3_price', highlight: true, ctaDark: true },
];

/** The dark "AMO — 5 levels" block from the Offre page. */
export async function OfferTiers() {
  const t = await getTranslations();
  return (
    <div className="amo-block">
      <div className="ah">{t.raw('amo_h')}</div>
      <div className="ap">{t.raw('amo_p')}</div>
      <div className="tiers">
        {TIERS.map((tier) => (
          <div key={tier.prefix} className={tier.highlight ? 'tier full' : 'tier'}>
            <span className="steps">{t.raw(`${tier.prefix}_steps`)}</span>
            <h5>{t.raw(`${tier.prefix}_h`)}</h5>
            <Html as="ul" html={t.raw(`${tier.prefix}_inc`)} />
            <div className="deliv">{t.raw(`${tier.prefix}_deliv`)}</div>
            <div className="tprice">{t.raw(tier.priceKey)}</div>
            <Button href="/contact" variant={tier.ctaDark ? 'dark' : 'solid'} className="btn">
              {t.raw('tier_cta')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The dark "Missions à la carte" card. */
export async function AlaCarteCard() {
  const t = await getTranslations();
  return (
    <div className="pdetail dark">
      <div className="pd-side">
        <div className="badge">{t.raw('c_badge')}</div>
        <h3>{t.raw('c_h3')}</h3>
        <div className="who">{t.raw('c_who')}</div>
        <div className="price">{t.raw('c_price')}</div>
        <div className="punit">{t.raw('c_punit')}</div>
        <Button href="/contact" variant="ghost">
          {t.raw('c_cta')}
        </Button>
      </div>
      <div className="pd-body">
        <div className="grp">
          <h4>{t.raw('c_examples_h')}</h4>
          <Html as="ul" html={t.raw('c_recv')} />
        </div>
        <Html className="pd-meta" html={t.raw('c_meta')} />
      </div>
    </div>
  );
}
