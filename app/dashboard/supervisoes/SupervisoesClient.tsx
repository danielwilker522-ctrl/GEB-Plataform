'use client';

import { useState, useTransition } from 'react';
import { registarSupervisao } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

const inputClass = 'w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-vine focus:outline-none text-sm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SupervisoesClient({ supervisores, supervisoes, grupos }: { supervisores: any[]; supervisoes: any[]; grupos: any[] }) {
  const [tab, setTab] = useState<'supervisores' | 'historico' | 'registar'>('supervisores');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [form, setForm] = useState({
    grupo_id: '',
    supervisor_id: '',
    data_visita: new Date().toISOString().split('T')[0],
    relatorio: '',
    proxima_visita: '',
  });

  function update(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleRegistar(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await registarSupervisao({
        grupo_id: form.grupo_id,
        supervisor_id: form.supervisor_id,
        data_visita: form.data_visita,
        relatorio: form.relatorio || undefined,
        proxima_visita: form.proxima_visita || undefined,
      });
      if (!result.success) { setError(result.error); return; }
      setSuccess(true);
      setForm({ grupo_id: '', supervisor_id: '', data_visita: new Date().toISOString().split('T')[0], relatorio: '', proxima_visita: '' });
      router.refresh();
    });
  }

  return (
    <>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-line">
        {([['supervisores', 'Supervisores'], ['historico', 'Histórico de Visitas'], ['registar', 'Registar Visita']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSuccess(false); }}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${tab === key ? 'border-vine text-vine' : 'border-transparent text-ink/50 hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Supervisores */}
      {tab === 'supervisores' && (
        <div className="overflow-hidden rounded-xl border border-line bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-paper-dim">
                <tr>
                  {['Supervisor', 'Área', 'Equipa', 'Contacto', 'Estado'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {supervisores.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-ink/40">Nenhum supervisor registado.</td></tr>
                ) : supervisores.map((s) => (
                  <tr key={s.id} className="hover:bg-paper-dim/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{s.profiles?.nome_completo ?? '—'}</p>
                      <p className="text-xs text-ink/45">{s.profiles?.email ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{s.area ?? '—'}</td>
                    <td className="px-4 py-3 text-ink/70">{s.equipas?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-ink/70">{s.contacto ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.ativo ? 'bg-vine/15 text-vine-deep' : 'bg-clay/15 text-clay'}`}>
                        {s.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Histórico */}
      {tab === 'historico' && (
        <div className="overflow-hidden rounded-xl border border-line bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-paper-dim">
                <tr>
                  {['Data', 'Grupo', 'Supervisor', 'Próxima Visita', 'Relatório'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {supervisoes.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-ink/40">Nenhuma visita registada.</td></tr>
                ) : supervisoes.map((s) => (
                  <tr key={s.id} className="hover:bg-paper-dim/50 transition">
                    <td className="px-4 py-3 text-ink/70">{new Date(s.data_visita).toLocaleDateString('pt-AO')}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{s.grupos?.nome_grupo ?? '—'}</p>
                      <p className="text-xs text-ink/45">{s.grupos?.municipio ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{s.supervisores?.profiles?.nome_completo ?? '—'}</td>
                    <td className="px-4 py-3 text-ink/60">{s.proxima_visita ? new Date(s.proxima_visita).toLocaleDateString('pt-AO') : '—'}</td>
                    <td className="px-4 py-3 max-w-xs text-ink/60 truncate">{s.relatorio ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Registar Visita */}
      {tab === 'registar' && (
        <div className="max-w-xl">
          {success && (
            <div className="mb-4 rounded-lg bg-vine/10 border border-vine/20 px-4 py-3 text-sm text-vine-deep">
              Visita registada com sucesso!
            </div>
          )}
          <form onSubmit={handleRegistar} className="rounded-xl border border-line bg-paper p-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Grupo <span className="text-clay">*</span></span>
              <select required value={form.grupo_id} onChange={(e) => update('grupo_id', e.target.value)} className={inputClass}>
                <option value="">— Selecionar grupo —</option>
                {grupos.map((g) => <option key={g.id} value={g.id}>{g.nome_grupo} {g.municipio ? `· ${g.municipio}` : ''}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Supervisor <span className="text-clay">*</span></span>
              <select required value={form.supervisor_id} onChange={(e) => update('supervisor_id', e.target.value)} className={inputClass}>
                <option value="">— Selecionar supervisor —</option>
                {supervisores.map((s) => <option key={s.id} value={s.id}>{s.profiles?.nome_completo ?? s.id}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Data da Visita <span className="text-clay">*</span></span>
              <input required type="date" value={form.data_visita} onChange={(e) => update('data_visita', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Próxima Visita</span>
              <input type="date" value={form.proxima_visita} onChange={(e) => update('proxima_visita', e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/70">Relatório</span>
              <textarea rows={4} value={form.relatorio} onChange={(e) => update('relatorio', e.target.value)} className={inputClass} placeholder="Observações da visita..." />
            </label>
            {error && <p className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>}
            <button type="submit" disabled={isPending} className="rounded-full bg-vine px-7 py-3 text-sm font-medium text-paper hover:bg-vine-deep transition disabled:opacity-50">
              {isPending ? 'A registar...' : 'Registar Visita'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
