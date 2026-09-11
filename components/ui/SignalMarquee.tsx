const items = [
  "DESIGN PREMIUM",
  "NEXT.JS",
  "REACT",
  "TYPESCRIPT",
  "PERFORMANCE",
  "SEO",
  "RESPONSIVE",
  "CONVERSÃO",
];

export function SignalMarquee() {
  return (
    <div className="signal-marquee border-y border-line" aria-label="Tecnologias e diferenciais">
      <div className="signal-marquee__track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="signal-marquee__item">
            <i aria-hidden />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
