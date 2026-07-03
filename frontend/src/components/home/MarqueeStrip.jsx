const ITEMS = [
  'BIS Hallmarked',
  '✦',
  'Free Insured Shipping',
  '✦',
  '30-Day Easy Returns',
  '✦',
  'Lifetime Exchange',
  '✦',
  'EMI Available',
  '✦',
  'Certified Diamonds',
  '✦',
  'Custom Jewellery',
  '✦',
]

export default function MarqueeStrip({ dark = false }) {
  const content = [...ITEMS, ...ITEMS]

  return (
    <div className={`py-4 overflow-hidden border-y ${dark ? 'bg-dark border-white/5' : 'bg-gold-500/5 border-gold-500/10'}`}>
      <div className="marquee-track">
        {content.map((item, i) => (
          <span
            key={i}
            className={`px-6 font-poppins text-xs font-medium tracking-[0.2em] uppercase flex-shrink-0
              ${item === '✦' ? 'text-gold-500' : dark ? 'text-cream/40' : 'text-dark/40'}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
