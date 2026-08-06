import AbrirGrupoForm from "./AbrirGrupoForm";

export default function AbrirGrupoSection() {
  return (
    <section id="abrir-grupo" className="bg-night px-6 py-20 text-paper">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Dê o primeiro passo
          </p>
          <h2 className="font-display text-3xl text-paper sm:text-4xl">
            Abra um Grupo de Estudo Bíblico na sua Casa
          </h2>
          <p className="mt-4 text-paper/65">
            Preenche o formulário — a equipa entra em contacto para os
            próximos passos.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-line-dark bg-paper p-6 sm:p-10">
          <AbrirGrupoForm />
        </div>
      </div>
    </section>
  );
}
