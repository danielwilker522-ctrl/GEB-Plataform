export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-night text-paper">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 100%, rgba(240,201,58,0.22) 0%, rgba(221,107,36,0.14) 35%, rgba(23,17,12,0) 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        <div>
          <p className="mb-5 font-display text-2xl italic text-gold">
            Seja bem-vindo.
          </p>
          <h1 className="font-display text-4xl leading-[1.1] text-paper sm:text-5xl lg:text-6xl">
            Leve a Palavra de Deus até à{" "}
            <span className="text-gold">sua casa</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70">
            Faça parte do Grupo de Estudo Bíblico e ajude a expandir o Reino
            de Deus através de pequenos grupos.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#abrir-grupo"
              className="rounded-full bg-vine px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-vine-deep"
            >
              Abrir um Grupo
            </a>
            <a
              href="#quem-somos"
              className="rounded-full border border-paper/25 px-7 py-3.5 text-sm font-medium text-paper transition hover:border-paper/50"
            >
              Saiba Mais
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <DuskIllustration />
        </div>
      </div>
    </section>
  );
}

function DuskIllustration() {
  // Um horizonte ao anoitecer: a cruz erguida, luz a espalhar-se, e um
  // grupo reunido junto à luz — a mesma ideia do departamento em forma visual.
  const group = [-46, -26, -8, 10, 28, 46];

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="sun" cx="50%" cy="62%" r="55%">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--vine)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--vine)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skyline" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--night)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--night)" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="248" r="150" fill="url(#sun)" />

      {/* horizonte */}
      <line x1="30" y1="270" x2="370" y2="270" stroke="var(--paper)" strokeOpacity="0.15" />

      {/* cruz */}
      <rect x="196" y="140" width="8" height="110" fill="var(--paper)" fillOpacity="0.85" />
      <rect x="168" y="168" width="64" height="8" fill="var(--paper)" fillOpacity="0.85" />

      {/* grupo reunido junto à luz */}
      {group.map((dx, i) => (
        <circle
          key={i}
          cx={200 + dx}
          cy={278 - Math.abs(dx) * 0.15}
          r={i === 2 || i === 3 ? 9 : 7}
          fill="var(--night)"
          stroke="var(--gold)"
          strokeOpacity="0.5"
        />
      ))}

      <rect x="0" y="300" width="400" height="100" fill="url(#skyline)" />
    </svg>
  );
}
