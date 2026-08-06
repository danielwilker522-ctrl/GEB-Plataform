import { createClient } from "@/lib/supabase/server";
import StatsCards from "@/app/dashboard/components/StatsCards";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Buscar indicadores em paralelo
  const [
    { count: totalGrupos },
    { count: gruposAtivos },
    { count: gruposInativos },
    { count: pedidosPendentes },
    { count: totalSupervisores },
    { count: totalEquipas },
    { data: pedidosRecentes },
    { data: gruposRecentes },
  ] = await Promise.all([
    supabase.from("grupos").select("*", { count: "exact", head: true }),
    supabase.from("grupos").select("*", { count: "exact", head: true }).eq("estado", "ativo"),
    supabase.from("grupos").select("*", { count: "exact", head: true }).eq("estado", "inativo"),
    supabase.from("pedidos_abertura").select("*", { count: "exact", head: true }).eq("estado", "pendente"),
    supabase.from("supervisores").select("*", { count: "exact", head: true }).eq("ativo", true),
    supabase.from("equipas").select("*", { count: "exact", head: true }).eq("ativo", true),
    supabase.from("pedidos_abertura").select("id, nome_completo, municipio, created_at, estado").order("created_at", { ascending: false }).limit(5),
    supabase.from("grupos").select("id, nome_grupo, municipio, estado, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  // Grupos novos este mês
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const { count: novosMes } = await supabase
    .from("grupos")
    .select("*", { count: "exact", head: true })
    .gte("created_at", inicioMes.toISOString());

  const stats = [
    { label: "Total de Grupos", value: totalGrupos ?? 0, color: "default" as const },
    { label: "Grupos Ativos", value: gruposAtivos ?? 0, color: "vine" as const },
    { label: "Grupos Inativos", value: gruposInativos ?? 0, color: "clay" as const },
    { label: "Pedidos Pendentes", value: pedidosPendentes ?? 0, color: "gold" as const, sub: "aguardam análise" },
    { label: "Supervisores", value: totalSupervisores ?? 0, color: "default" as const },
    { label: "Equipas", value: totalEquipas ?? 0, color: "default" as const },
    { label: "Novos este mês", value: novosMes ?? 0, color: "vine" as const },
    { label: "Em Acompanhamento", value: (totalGrupos ?? 0) - (gruposAtivos ?? 0) - (gruposInativos ?? 0), color: "default" as const },
  ];

  const estadoBadge: Record<string, string> = {
    pendente: "bg-gold/20 text-gold-deep",
    aprovado: "bg-vine/15 text-vine-deep",
    rejeitado: "bg-clay/15 text-clay",
    ativo: "bg-vine/15 text-vine-deep",
    inativo: "bg-clay/15 text-clay",
    em_acompanhamento: "bg-gold/20 text-gold-deep",
    encerrado: "bg-ink/10 text-ink/50",
  };

  function fmtData(d: string) {
    return new Date(d).toLocaleDateString("pt-AO", { day: "2-digit", month: "short" });
  }

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Dashboard</h1>
        <p className="text-sm text-ink/50">Visão geral do departamento GEB</p>
      </div>

      <StatsCards stats={stats} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Últimos pedidos */}
        <div className="rounded-xl border border-line bg-paper">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-medium text-ink">Últimos Pedidos</h2>
            <a href="/dashboard/pedidos" className="text-xs text-vine hover:underline">
              Ver todos →
            </a>
          </div>
          {pedidosRecentes && pedidosRecentes.length > 0 ? (
            <ul className="divide-y divide-line">
              {pedidosRecentes.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.nome_completo}</p>
                    <p className="text-xs text-ink/45">{p.municipio ?? "—"} · {fmtData(p.created_at)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${estadoBadge[p.estado] ?? ""}`}>
                    {p.estado}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-ink/40">Nenhum pedido ainda.</p>
          )}
        </div>

        {/* Últimos grupos */}
        <div className="rounded-xl border border-line bg-paper">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-medium text-ink">Grupos Recentes</h2>
            <a href="/dashboard/grupos" className="text-xs text-vine hover:underline">
              Ver todos →
            </a>
          </div>
          {gruposRecentes && gruposRecentes.length > 0 ? (
            <ul className="divide-y divide-line">
              {gruposRecentes.map((g) => (
                <li key={g.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{g.nome_grupo}</p>
                    <p className="text-xs text-ink/45">{g.municipio ?? "—"} · {fmtData(g.created_at)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${estadoBadge[g.estado] ?? ""}`}>
                    {g.estado.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-ink/40">Nenhum grupo ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
