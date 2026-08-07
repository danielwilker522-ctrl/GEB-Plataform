'use client';

import { useState, useTransition } from 'react';
import { alterarEstadoGrupo } from '@/app/actions/grupos';
import type { EstadoGrupo } from '@/types/database.types';
import { useRouter } from 'next/navigation';

const estadoBadge: Record<string, string> = {
  ativo: 'bg-vine/15 text-vine-deep',
  em_acompanhamento: 'bg-gold/20 text-gold-deep',
  inativo: 'bg-clay/15 text-clay',
  encerrado: 'bg-ink/10 text-ink/50',
};

const estadoLabel: Record<string, string> = {
  ativo: 'Ativo',
  em_acompanhamento: 'Em Acompanhamento',
  inativo: 'Inativo',
  encerrado: 'Encerrado',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GruposTable({ grupos, supervisores }: { grupos: any[]; supervisores: any[] }) {
  const [filtro, setFiltro] = useState<'todos' | EstadoGrupo>('todos');
  const [selected, setSelected] = useState<typeof grupos[0] | null>(null);
  const [showEstado, setShowEstado] = useState(false);
  const [novoEstado, setNovoEstado] = useState<EstadoGrupo>('ativo');
  const [motivo, setMotivo] = useState('');
  const [solucao, setSolucao] = useState('');
  const [dataOcorrencia, setDataOcorrencia] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtrados = filtro === 'todos' ? grupos : grupos.filter((g) => g.estado === filtro);

  function handleAlterarEstado() {
    if (!selected) return;
    startTransition(async () => {
      await alterarEstadoGrupo(selected.id, novoEstado, {
        motivo_inatividade: motivo || undefined,
        solucao_proposta: solucao || undefined,
        data_ocorrencia: dataOcorrencia || undefined,
      });
      setShowEstado(false);
      setSelected(null);
      router.refresh();
    });
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['todos', 'ativo', 'em_acompanhamento', 'inativo', 'encerrado'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
              filtro === f
                ? 'bg-vine text-paper'
                : 'border border-line text-ink/60 hover:border-ink/40'
            }`}
          >
            {f === 'todos' ? 'Todos' : estadoLabel[f]}
            <span className="ml-1.5 text-xs opacity-60">
              ({f === 'todos' ? grupos.length : grupos.filter((g) => g.estado === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-line bg-paper">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper-dim">
              <tr>
                {['Nº', 'Grupo', 'Responsável', 'Localização', 'Supervisor', 'Estado', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-ink/40">
                    Nenhum grupo encontrado.
                  </td>
                </tr>
              ) : filtrados.map((g) => (
                <tr key={g.id} className="hover:bg-paper-dim/50 transition">
                  <td className="px-4 py-3 text-ink/50 font-mono text-xs">{g.numero_grupo}</td>
                  <td className="px-4 py-3 font-medium text-ink">{g.nome_grupo}</td>
                  <td className="px-4 py-3 text-ink/70">
                    <div>{g.responsavel_nome}</div>
                    {g.responsavel_telefone && (
                      <div className="text-xs text-ink/45">{g.responsavel_telefone}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {[g.bairro, g.municipio].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {g.supervisores?.profiles?.nome_completo ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoBadge[g.estado]}`}>
                      {estadoLabel[g.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(g)}
                        className="rounded-lg border border-line px-3 py-1 text-xs text-ink/60 hover:border-ink/40 transition"
                      >
                        Ver
                      </button>
                      <a
                        href={`/dashboard/grupos/${g.id}/editar`}
                        className="rounded-lg border border-line px-3 py-1 text-xs text-ink/60 hover:border-ink/40 transition"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => { setSelected(g); setNovoEstado(g.estado); setShowEstado(true); }}
                        className="rounded-lg border border-vine/40 px-3 py-1 text-xs text-vine hover:bg-vine/10 transition"
                      >
                        Estado
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ver detalhe */}
      {selected && !showEstado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-paper p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs text-ink/45 font-mono">{selected.numero_grupo}</p>
                <h2 className="font-display text-xl text-ink">{selected.nome_grupo}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-ink/40 hover:text-ink text-xl">×</button>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ['Responsável', selected.responsavel_nome],
                ['Telefone', selected.responsavel_telefone ?? '—'],
                ['Email', selected.responsavel_email ?? '—'],
                ['Bairro', selected.bairro ?? '—'],
                ['Município', selected.municipio ?? '—'],
                ['Província', selected.provincia ?? '—'],
                ['Localização', selected.localizacao ?? '—'],
                ['Participantes', selected.numero_participantes?.toString() ?? '—'],
                ['Abertura', selected.data_abertura],
                ['Estado', estadoLabel[selected.estado]],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink/45">{label}</dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            {selected.estado === 'inativo' && (
              <div className="mt-4 rounded-lg bg-clay/10 p-3 text-sm">
                {selected.motivo_inatividade && <p><span className="font-medium text-clay">Motivo:</span> {selected.motivo_inatividade}</p>}
                {selected.solucao_proposta && <p className="mt-1"><span className="font-medium text-clay">Solução:</span> {selected.solucao_proposta}</p>}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <a
                href={`/dashboard/grupos/${selected.id}/editar`}
                className="flex-1 rounded-full border border-line py-2.5 text-center text-sm text-ink/70 hover:border-ink/40 transition"
              >
                Editar
              </a>
              <button
                onClick={() => setShowEstado(true)}
                className="flex-1 rounded-full bg-vine py-2.5 text-sm font-medium text-paper hover:bg-vine-deep transition"
              >
                Alterar Estado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alterar Estado */}
      {selected && showEstado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="font-display text-xl text-ink">Alterar Estado</h2>
              <button onClick={() => { setShowEstado(false); setSelected(null); }} className="text-ink/40 hover:text-ink text-xl">×</button>
            </div>

            <p className="mb-4 text-sm text-ink/60">{selected.nome_grupo}</p>

            <label className="block mb-4">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Novo Estado</span>
              <select
                value={novoEstado}
                onChange={(e) => setNovoEstado(e.target.value as EstadoGrupo)}
                className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink focus:border-vine focus:outline-none"
              >
                <option value="ativo">Ativo</option>
                <option value="em_acompanhamento">Em Acompanhamento</option>
                <option value="inativo">Inativo</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </label>

            {(novoEstado === 'inativo' || novoEstado === 'em_acompanhamento') && (
              <>
                <label className="block mb-3">
                  <span className="mb-1.5 block text-sm font-medium text-ink/70">Motivo</span>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-vine focus:outline-none"
                  />
                </label>
                <label className="block mb-3">
                  <span className="mb-1.5 block text-sm font-medium text-ink/70">Solução Proposta</span>
                  <textarea
                    value={solucao}
                    onChange={(e) => setSolucao(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-vine focus:outline-none"
                  />
                </label>
                <label className="block mb-4">
                  <span className="mb-1.5 block text-sm font-medium text-ink/70">Data da Ocorrência</span>
                  <input
                    type="date"
                    value={dataOcorrencia}
                    onChange={(e) => setDataOcorrencia(e.target.value)}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-vine focus:outline-none"
                  />
                </label>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAlterarEstado}
                disabled={isPending}
                className="flex-1 rounded-full bg-vine py-2.5 text-sm font-medium text-paper hover:bg-vine-deep transition disabled:opacity-50"
              >
                {isPending ? 'A guardar...' : 'Guardar'}
              </button>
              <button
                onClick={() => { setShowEstado(false); setSelected(null); }}
                className="rounded-full border border-line px-5 py-2.5 text-sm text-ink/60 hover:border-ink/40 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
