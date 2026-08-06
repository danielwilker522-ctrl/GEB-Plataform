"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/dashboard/pedidos", label: "Pedidos de Abertura", icon: "📋" },
  { href: "/dashboard/grupos", label: "Grupos", icon: "🏠" },
  { href: "/dashboard/supervisoes", label: "Supervisões", icon: "👁" },
  { href: "/dashboard/equipas", label: "Equipas", icon: "👥" },
  { href: "/dashboard/relatorios", label: "Relatórios", icon: "📊" },
  { href: "/dashboard/utilizadores", label: "Utilizadores", icon: "🔑" },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: "⚙" },
];

type Profile = { nome_completo: string; role: string } | null;

export default function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const roleLabel: Record<string, string> = {
    admin_geral: "Admin Geral",
    admin_geb: "Admin GEB",
    supervisor: "Supervisor",
    secretario: "Secretário",
    visitante: "Visitante",
  };

  return (
    <>
      {/* Topbar mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-night px-4 py-3 lg:hidden">
        <span className="font-display text-lg font-semibold text-gold">GEB</span>
        <button onClick={() => setOpen((v) => !v)} className="text-paper" aria-label="Menu">
          ☰
        </button>
      </div>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line-dark bg-night transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="border-b border-line-dark px-6 py-5">
          <p className="font-display text-xl font-semibold text-gold">GEB</p>
          <p className="text-xs text-paper/40">Área Administrativa</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                      active
                        ? "bg-vine text-paper"
                        : "text-paper/60 hover:bg-paper/5 hover:text-paper"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User & logout */}
        <div className="border-t border-line-dark px-4 py-4">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-paper">{profile?.nome_completo ?? "—"}</p>
            <p className="text-xs text-paper/40">
              {profile?.role ? roleLabel[profile.role] ?? profile.role : "—"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-paper/50 transition hover:bg-paper/5 hover:text-paper"
          >
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
