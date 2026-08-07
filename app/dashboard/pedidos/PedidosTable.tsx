'use client';

import { useState, useTransition } from 'react';
import { atualizarEstadoPedido } from '@/app/actions/pedidos';
import type { PedidoAbertura } from '@/types/database.types';
import { useRouter } from 'next/navigation';

const estadoBadge: Record<string, string> = {
  pendente: 'bg-gold/20 text-gold-deep',
  aprovado: 'bg-vine/15 text-vine-deep',
  rejeitado: 'bg-clay/15 text-clay',
};

function fmtData(d: string) {
  return new Date(d).toLocaleDateString('pt-AO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function PedidosTable({ pedidos }: { pedidos: PedidoAbertura[] }) {
  const [filtro, setFiltro] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');
  const [selected, setSelected] = useState<PedidoAbertura | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [showRejeitar, setShowRejeitar] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtrados = filtro === 'todos'
    ? pedidos
    : pedidos.filter((p) => p.estado === filtro);

  function handleAprovar(id: string) {
    startTransition(async () => {
      await atualizarEstadoPedido(id, 'aprovado');
      setSelected(null);
      router.refresh();
    });
  }

  function handleRejeitar(id: string) {
    startTransition(async () => {
      await atualizarEstadoPedido(id, 'rejeitado', motivoRejeicao);
      setSelected(null);
      setShowRejeitar(false);
      setMotivoRejeicao('');
      router.refresh();
    });
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-4 flex gap-2">
        {(['todos', 'pendente', 'aprovado', 'rejeitado'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
              filtro === f
                ? 'bg-vine text-paper'
                : 'border border-line text-ink/60 hover:border-ink/40'
            }`}
          >
            {f === 'todos' ? 'Todos' : f}
            {f !== 'todos' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({pedidos.filter((p) => p.estado === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-line bg-paper">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper-dim">
              <tr>
                {['Nome', 'Telefone', 'Localização', 'Data', 'Estado', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-ink/40">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filtrados.map((p) => (
                  <tr key={p.id} className="hover:bg-paper-dim/50 transition">
                    <td className="px-4 py-3 font-medium text-ink">{p.nome_completo}</td>
                    <td className="px-4 py-3 text-ink/70">{p.telefone}</td>
                    <td className="px-4 py-3 text-ink/70">
                      {[p.bairro, p.municipio, p.provincia].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-ink/60">{fmtData(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${estadoBadge[p.estado]}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(p)}
                          className="rounded-lg border border-line px-3 py-1 text-xs text-ink/60 hover:border-ink/40 hover:text-ink transition"
                        >
                          Ver
                        </button>
                        {p.estado === 'pendente' && (
                          <>
                            <button
                              onClick={() => handleAprovar(p.id)}
                              disabled={isPending}
                              className="rounded-lg bg-vine px-3 py-1 text-xs text-paper hover:bg-vine-deep transition disabled:opacity-50"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => { setSelected(p); setShowRejeitar(true); }}
                              disabled={isPending}
                              className="rounded-lg bg-clay/15 px-3 py-1 text-xs text-clay hover:bg-clay/25 transition disabled:opacity-50"
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalhe / rejeição */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-paper p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl text-ink">{selected.nome_completo}</h2>
                <p className="text-sm text-ink/50">{fmtData(selected.created_at)}</p>
              </div>
              <button
                onClick={() => { setSelected(null); setShowRejeitar(false); setMotivoRejeicao(''); }}
                className="text-ink/40 hover:text-ink text-xl leading-none"
              >
                ×
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ['Telefone', selected.telefone],
                ['Email', selected.email ?? '—'],
                ['Bairro', selected.bairro ?? '—'],
                ['Município', selected.municipio ?? '—'],
                ['Província', selected.provincia ?? '—'],
                ['Localização', selected.localizacao ?? '—'],
                ['Participantes', selected.numero_participantes?.toString() ?? '—'],
                ['Horário', selected.horario ?? '—'],
                ['Dias', selected.dias_disponiveis?.join(', ') ?? '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink/45">{label}</dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            {selected.observacoes && (
              <div className="mt-4 rounded-lg bg-paper-dim p-3 text-sm text-ink/70">
                <span className="font-medium">Observações: </span>{selected.observacoes}
              </div>
            )}

            {showRejeitar && selected.estado === 'pendente' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-ink/70 mb-1">
                  Motivo da rejeição (opcional)
                </label>
                <textarea
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-clay focus:outline-none"
                  placeholder="Descreve o motivo..."
                />
              </div>
            )}

            {selected.estado === 'pendente' && (
              <div className="mt-5 flex gap-3">
                {!showRejeitar ? (
                  <>
                    <button
                      onClick={() => handleAprovar(selected.id)}
                      disabled={isPending}
                      className="flex-1 rounded-full bg-vine py-2.5 text-sm font-medium text-paper hover:bg-vine-deep transition disabled:opacity-50"
                    >
                      {isPending ? 'A processar...' : 'Aprovar'}
                    </button>
                    <button
                      onClick={() => setShowRejeitar(true)}
                      className="flex-1 rounded-full border border-clay py-2.5 text-sm font-medium text-clay hover:bg-clay/10 transition"
                    >
                      Rejeitar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleRejeitar(selected.id)}
                      disabled={isPending}
                      className="flex-1 rounded-full bg-clay py-2.5 text-sm font-medium text-paper hover:bg-clay/80 transition disabled:opacity-50"
                    >
                      {isPending ? 'A processar...' : 'Confirmar Rejeição'}
                    </button>
                    <button
                      onClick={() => setShowRejeitar(false)}
                      className="rounded-full border border-line px-4 py-2.5 text-sm text-ink/60 hover:border-ink/40 transition"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
