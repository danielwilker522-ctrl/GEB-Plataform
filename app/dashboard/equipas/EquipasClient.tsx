'use client';

import { useState, useTransition } from 'react';
import { criarEquipa, editarEquipa } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

const inputClass = 'w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-vine focus:outline-none text-sm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EquipasClient({ equipas, profiles }: { equipas: any[]; profiles: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<typeof equipas[0] | null>(null);
  const [nome, setNome] = useState('');
  const [coordenadorId, setCoordenadorId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function openCreate() {
    setEditing(null); setNome(''); setCoordenadorId(''); setDescricao(''); setShowForm(true);
  }

  function openEdit(e: typeof equipas[0]) {
    setEditing(e); setNome(e.nome); setCoordenadorId(e.coordenador_id ?? ''); setDescricao(e.descricao ?? ''); setShowForm(true);
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError('');
    startTransition(async () => {
      const result = editing
        ? await editarEquipa(editing.id, { nome, coordenador_id: coordenadorId || undefined, descricao: descricao || undefined })
        : await criarEquipa({ nome, coordenador_id: coordenadorId || undefined, descricao: descricao || undefined });
      if (!result.success) { setError(result.error); return; }
      setShowForm(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button onClick={openCreate} className="rounded-full bg-vine px-5 py-2.5 text-sm font-medium text-paper hover:bg-vine-deep transition">
          + Nova Equipa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipas.length === 0 ? (
          <div className="col-span-full rounded-xl border border-line bg-paper px-6 py-12 text-center text-sm text-ink/40">
            Nenhuma equipa criada ainda.
          </div>
        ) : equipas.map((eq) => (
          <div key={eq.id} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-ink">{eq.nome}</p>
                {eq.profiles?.nome_completo && (
                  <p className="text-xs text-ink/50 mt-0.5">Coord: {eq.profiles.nome_completo}</p>
                )}
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${eq.ativo ? 'bg-vine/15 text-vine-deep' : 'bg-clay/15 text-clay'}`}>
                {eq.ativo ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            {eq.descricao && <p className="mt-2 text-sm text-ink/60">{eq.descricao}</p>}
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-xs text-ink/45 mb-1">Membros ({eq.equipa_membros?.length ?? 0})</p>
              <div className="flex flex-wrap gap-1">
                {eq.equipa_membros?.slice(0, 4).map((m: { profile_id: string; profiles?: { nome_completo?: string } }) => (
                  <span key={m.profile_id} className="rounded-full bg-paper-dim px-2 py-0.5 text-xs text-ink/60">
                    {m.profiles?.nome_completo ?? '—'}
                  </span>
                ))}
                {(eq.equipa_membros?.length ?? 0) > 4 && (
                  <span className="text-xs text-ink/40">+{eq.equipa_membros.length - 4}</span>
                )}
              </div>
            </div>
            <button onClick={() => openEdit(eq)} className="mt-3 text-xs text-vine hover:underline">Editar</button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">{editing ? 'Editar Equipa' : 'Nova Equipa'}</h2>
              <button onClick={() => setShowForm(false)} className="text-ink/40 hover:text-ink text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/70">Nome <span className="text-clay">*</span></span>
                <input required value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/70">Coordenador</span>
                <select value={coordenadorId} onChange={(e) => setCoordenadorId(e.target.value)} className={inputClass}>
                  <option value="">— Sem coordenador —</option>
                  {profiles.map((p) => <option key={p.id} value={p.id}>{p.nome_completo}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/70">Descrição</span>
                <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} className={inputClass} />
              </label>
              {error && <p className="text-sm text-clay">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={isPending} className="flex-1 rounded-full bg-vine py-2.5 text-sm font-medium text-paper hover:bg-vine-deep transition disabled:opacity-50">
                  {isPending ? 'A guardar...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-line px-5 text-sm text-ink/60">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
