export default function Footer() {
  return (
    <footer id="contactos" className="border-t border-line-dark bg-night px-6 py-14 text-paper/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-gold">GEB</p>
          <p className="mt-1 text-sm text-paper/50">
            Departamento de Grupos de Estudo Bíblico
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
            Ministério El Shalom — Igreja Shalom
          </p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-paper">Morada</p>
          <p className="mt-2 max-w-xs text-paper/60">
            Rua Principal da Mitcha, depois da ponte, lado direito — Lubango
          </p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-paper">Contactos</p>
          <p className="mt-2 text-paper/60">923 488 620</p>
          <p className="text-paper/60">923 708 028</p>
          <p className="text-paper/60">927 679 333</p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-paper">Online</p>
          <a
            href="https://shalomministerio.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-paper/60 underline-grow"
          >
            shalomministerio.org
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-xs text-paper/35">
        © {new Date().getFullYear()} GEB — Grupo de Estudo Bíblico. Ministério El Shalom.
      </p>
    </footer>
  );
}
