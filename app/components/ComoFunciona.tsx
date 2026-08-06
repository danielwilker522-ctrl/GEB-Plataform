import { comoFunciona } from "@/lib/site-content";

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="border-t border-line px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-vine">
            Como Funciona
          </p>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Do pedido à rede de grupos
          </h2>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {comoFunciona.map((etapa, i) => (
            <li key={etapa.titulo} className="relative pl-2">
              <span className="font-display text-4xl text-gold/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-medium text-ink">{etapa.titulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{etapa.descricao}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
