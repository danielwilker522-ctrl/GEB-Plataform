'use client';

import { useState, useTransition } from 'react';
import { atualizarRole, toggleAtivoUtilizador } from '@/app/actions/admin';
import type { UserRole, Profile } from '@/types/database.types';
import { useRouter } from 'next/navigation';

const roleLabel: Record<UserRole, string> = {
  admin_geral: 'Admin Geral',
  admin_geb: 'Admin GEB',
  supervisor: 'Supervisor',
  secretario: 'Secretário',
  visitante: 'Visitante',
};

const roleBadge: Record<UserRole, string> = {
  admin_geral: 'bg-clay/15 text-clay',
  admin_geb: 'bg-vine/15 text-vine-deep',
  supervisor: 'bg-gold/20 text-gold-deep',
  secretario: 'bg-ink/10 text-ink/60',
  visitante: 'bg-paper-dim text-ink/40',
};

export default function UtilizadoresClient({ profiles, currentUserId }: { profiles: Profile[]; currentUserId: string }) {
  const [editing, setEditing] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('visitante');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function openEdit(p: Profile) {
    setEditing(p);
    setNewRole(p.role);
  }

  function handleSave() {
    if (!editing) return;
    startTransition(async () => {
      await atualizarRole(editing.id, newRole);
      setEditing(null);
      router.refresh();
    });
  }

  function handleToggle(id: string, ativo: boolean) {
    startTransition(async () => {
      await toggleAtivoUtilizador(id, !ativo);
      router.refresh();
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-line bg-paper">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper-dim">
              <tr>
                {['Nome', 'Email', 'Perfil', 'Estado', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {profiles.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-ink/40">Nenhum utilizador encontrado.</td></tr>
              ) : profiles.map((p) => (
                <tr key={p.id} className="hover:bg-paper-dim/50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{p.nome_completo}</p>
                    {p.id === currentUserId && <span className="text-xs text-vine">( tu )</span>}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{p.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[p.role]}`}>
                      {roleLabel[p.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.ativo ? 'bg-vine/15 text-vine-deep' : 'bg-clay/15 text-clay'}`}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        disabled={p.id === currentUserId}
                        className="rounded-lg border border-line px-3 py-1 text-xs text-ink/60 hover:border-ink/40 transition disabled:opacity-30"
                      >
                        Editar Role
                      </button>
                      {p.id !== currentUserId && (
                        <button
                          onClick={() => handleToggle(p.id, p.ativo)}
                          disabled={isPending}
                          className={`rounded-lg px-3 py-1 text-xs transition ${p.ativo ? 'border border-clay/40 text-clay hover:bg-clay/10' : 'border border-vine/40 text-vine hover:bg-vine/10'}`}
                        >
                          {p.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal editar role */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Alterar Perfil</h2>
              <button onClick={() => setEditing(null)} className="text-ink/40 hover:text-ink text-xl">×</button>
            </div>
            <p className="mb-4 text-sm text-ink/60">{editing.nome_completo}</p>
            <label className="block mb-5">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Perfil de acesso</span>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink focus:border-vine focus:outline-none text-sm"
              >
                {(Object.keys(roleLabel) as UserRole[]).map((r) => (
                  <option key={r} value={r}>{roleLabel[r]}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={isPending} className="flex-1 rounded-full bg-vine py-2.5 text-sm font-medium text-paper hover:bg-vine-deep transition disabled:opacity-50">
                {isPending ? 'A guardar...' : 'Guardar'}
              </button>
              <button onClick={() => setEditing(null)} className="rounded-full border border-line px-5 text-sm text-ink/60">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
