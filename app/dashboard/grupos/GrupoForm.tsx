'use client';

import { useState, useTransition } from 'react';
import { criarGrupo, editarGrupo } from '@/app/actions/grupos';
import { useRouter } from 'next/navigation';
import type { Grupo } from '@/types/database.types';

const inputClass = 'w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-vine focus:outline-none text-sm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GrupoForm({ supervisores, modo, grupo }: { supervisores: any[]; modo: 'criar' | 'editar'; grupo?: Grupo }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    numero_grupo: grupo?.numero_grupo ?? '',
    nome_grupo: grupo?.nome_grupo ?? '',
    responsavel_nome: grupo?.responsavel_nome ?? '',
    responsavel_telefone: grupo?.responsavel_telefone ?? '',
    responsavel_email: grupo?.responsavel_email ?? '',
    localizacao: grupo?.localizacao ?? '',
    bairro: grupo?.bairro ?? '',
    municipio: grupo?.municipio ?? '',
    provincia: grupo?.provincia ?? '',
    supervisor_id: grupo?.supervisor_id ?? '',
    data_abertura: grupo?.data_abertura ?? new Date().toISOString().split('T')[0],
    numero_participantes: grupo?.numero_participantes?.toString() ?? '',
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const payload = {
        ...form,
        numero_participantes: form.numero_participantes ? Number(form.numero_participantes) : undefined,
        supervisor_id: form.supervisor_id || undefined,
      };

      if (modo === 'criar') {
        const result = await criarGrupo(payload);
        if (!result.success) { setError(result.error); return; }
      } else if (grupo) {
        const result = await editarGrupo(grupo.id, payload);
        if (!result.success) { setError(result.error); return; }
      }
      router.push('/dashboard/grupos');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-paper p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Número do Grupo" required>
          <input required value={form.numero_grupo} onChange={(e) => update('numero_grupo', e.target.value)} className={inputClass} placeholder="Ex: GEB-001" />
        </Field>
        <Field label="Nome do Grupo" required>
          <input required value={form.nome_grupo} onChange={(e) => update('nome_grupo', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Nome do Responsável" required>
          <input required value={form.responsavel_nome} onChange={(e) => update('responsavel_nome', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Telefone do Responsável">
          <input value={form.responsavel_telefone} onChange={(e) => update('responsavel_telefone', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Email do Responsável">
          <input type="email" value={form.responsavel_email} onChange={(e) => update('responsavel_email', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Nº de Participantes">
          <input type="number" min={0} value={form.numero_participantes} onChange={(e) => update('numero_participantes', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Localização">
          <input value={form.localizacao} onChange={(e) => update('localizacao', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Bairro">
          <input value={form.bairro} onChange={(e) => update('bairro', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Município">
          <input value={form.municipio} onChange={(e) => update('municipio', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Província">
          <input value={form.provincia} onChange={(e) => update('provincia', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Supervisor Responsável">
          <select value={form.supervisor_id} onChange={(e) => update('supervisor_id', e.target.value)} className={inputClass}>
            <option value="">— Sem supervisor —</option>
            {supervisores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.profiles?.nome_completo ?? s.id}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Data de Abertura" required>
          <input required type="date" value={form.data_abertura} onChange={(e) => update('data_abertura', e.target.value)} className={inputClass} />
        </Field>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-vine px-7 py-3 text-sm font-medium text-paper hover:bg-vine-deep transition disabled:opacity-50"
        >
          {isPending ? 'A guardar...' : modo === 'criar' ? 'Criar Grupo' : 'Guardar Alterações'}
        </button>
        <a href="/dashboard/grupos" className="rounded-full border border-line px-7 py-3 text-sm text-ink/60 hover:border-ink/40 transition">
          Cancelar
        </a>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/70">
        {label}{required && <span className="text-clay"> *</span>}
      </span>
      {children}
    </label>
  );
}
