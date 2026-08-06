import { missaoVisaoValores } from "@/lib/site-content";

export default function MissaoVisaoValores() {
  return (
    <section id="missao-visao-valores" className="border-t border-line bg-paper-dim px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper p-8">
            <h3 className="font-display text-2xl text-gold-deep">Missão</h3>
            <p className="mt-4 leading-relaxed text-ink/80">{missaoVisaoValores.missao}</p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-8">
            <h3 className="font-display text-2xl text-vine">Visão</h3>
            <p className="mt-4 leading-relaxed text-ink/80">{missaoVisaoValores.visao}</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-display text-2xl text-ink">Valores</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {missaoVisaoValores.valores.map((valor) => (
              <div key={valor.titulo} className="border-l-2 border-gold pl-4">
                <p className="font-medium text-ink">{valor.titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">{valor.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
