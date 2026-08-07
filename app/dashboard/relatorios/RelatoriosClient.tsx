'use client';

const barColors = ['bg-vine', 'bg-gold', 'bg-clay', 'bg-ink/20', 'bg-vine/40'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RelatoriosClient({ stats, porMunicipio, supervisoesPorMes, grupos, supervisoes, pedidos }: {
  stats: { totalGrupos: number; ativos: number; inativos: number; emAcompanhamento: number; encerrados: number; novosMes: number };
  porMunicipio: Record<string, number>;
  supervisoesPorMes: Record<string, number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grupos: any[]; supervisoes: any[]; pedidos: any[];
}) {
  const maxMunicipio = Math.max(...Object.values(porMunicipio), 1);
  const maxSupervisao = Math.max(...Object.values(supervisoesPorMes), 1);

  function exportCSV(data: object[], filename: string) {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map((row) => keys.map((k) => JSON.stringify((row as Record<string, unknown>)[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {[
          { label: 'Total', value: stats.totalGrupos, color: 'text-ink' },
          { label: 'Ativos', value: stats.ativos, color: 'text-vine-deep' },
          { label: 'Inativos', value: stats.inativos, color: 'text-clay' },
          { label: 'Acompanhamento', value: stats.emAcompanhamento, color: 'text-gold-deep' },
          { label: 'Encerrados', value: stats.encerrados, color: 'text-ink/40' },
          { label: 'Novos este mês', value: stats.novosMes, color: 'text-vine-deep' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-paper p-4 text-center">
            <p className="text-xs text-ink/50">{s.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grupos por município */}
        <div className="rounded-xl border border-line bg-paper p-5">
          <h3 className="mb-4 font-medium text-ink">Grupos por Município</h3>
          {Object.keys(porMunicipio).length === 0 ? (
            <p className="text-sm text-ink/40">Sem dados.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(porMunicipio).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([mun, count], i) => (
                <div key={mun} className="flex items-center gap-3 text-sm">
                  <span className="w-28 shrink-0 text-ink/60 truncate">{mun}</span>
                  <div className="flex-1 h-5 rounded-full bg-paper-dim overflow-hidden">
                    <div className={`h-full rounded-full ${barColors[i % barColors.length]}`} style={{ width: `${(count / maxMunicipio) * 100}%` }} />
                  </div>
                  <span className="w-4 text-right text-ink/60 shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supervisões por mês */}
        <div className="rounded-xl border border-line bg-paper p-5">
          <h3 className="mb-4 font-medium text-ink">Supervisões por Mês</h3>
          {Object.keys(supervisoesPorMes).length === 0 ? (
            <p className="text-sm text-ink/40">Sem dados.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(supervisoesPorMes).slice(0, 6).map(([mes, count], i) => (
                <div key={mes} className="flex items-center gap-3 text-sm">
                  <span className="w-28 shrink-0 text-ink/60">{mes}</span>
                  <div className="flex-1 h-5 rounded-full bg-paper-dim overflow-hidden">
                    <div className={`h-full rounded-full ${barColors[i % barColors.length]}`} style={{ width: `${(count / maxSupervisao) * 100}%` }} />
                  </div>
                  <span className="w-4 text-right text-ink/60 shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exportação */}
      <div className="rounded-xl border border-line bg-paper p-5">
        <h3 className="mb-4 font-medium text-ink">Exportar Dados (CSV)</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => exportCSV(grupos, 'grupos.csv')} className="rounded-full border border-vine px-5 py-2 text-sm text-vine hover:bg-vine/10 transition">
            Grupos
          </button>
          <button onClick={() => exportCSV(supervisoes, 'supervisoes.csv')} className="rounded-full border border-vine px-5 py-2 text-sm text-vine hover:bg-vine/10 transition">
            Supervisões
          </button>
          <button onClick={() => exportCSV(pedidos, 'pedidos.csv')} className="rounded-full border border-vine px-5 py-2 text-sm text-vine hover:bg-vine/10 transition">
            Pedidos de Abertura
          </button>
        </div>
      </div>
    </div>
  );
}
