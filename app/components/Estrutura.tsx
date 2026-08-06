import { estrutura } from "@/lib/site-content";

export default function Estrutura() {
  return (
    <section id="estrutura" className="border-t border-line bg-paper-dim px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-vine">
            Estrutura do Departamento
          </p>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Subdepartamentos que sustentam cada grupo
          </h2>
        </div>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {estrutura.map((sub) => (
            <div
              key={sub.nome}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[220px_1fr] sm:items-baseline sm:gap-8"
            >
              <p className="font-display text-xl text-ink">{sub.nome}</p>
              <p className="text-ink/70">{sub.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
