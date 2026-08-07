'use client';

import { useState, useTransition } from 'react';
import { salvarConfiguracao } from '@/app/actions/admin';

const inputClass = 'w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-vine focus:outline-none text-sm';

export default function ConfiguracoesClient({ config }: { config: Record<string, Record<string, unknown>> }) {
  const dept = config['dados_departamento'] ?? {};
  const [form, setForm] = useState({
    nome: (dept['nome'] as string) ?? 'GEB — Grupo de Estudo Bíblico',
    igreja: (dept['igreja'] as string) ?? 'Ministério El Shalom',
    email: (dept['email'] as string) ?? '',
    telefone1: (dept['telefone1'] as string) ?? '923 488 620',
    telefone2: (dept['telefone2'] as string) ?? '923 708 028',
    telefone3: (dept['telefone3'] as string) ?? '927 679 333',
    morada: (dept['morada'] as string) ?? 'Rua Principal da Mitcha, depois da ponte, lado direito — Lubango',
    site: (dept['site'] as string) ?? 'shalomministerio.org',
    facebook: (dept['facebook'] as string) ?? 'Shalom Ministerio',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function update(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await salvarConfiguracao('dados_departamento', form);
      if (!result.success) { setError(result.error); return; }
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Section title="Departamento">
        <Field label="Nome do departamento">
          <input value={form.nome} onChange={(e) => update('nome', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Igreja / Ministério">
          <input value={form.igreja} onChange={(e) => update('igreja', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Email de contacto">
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} placeholder="geb@exemplo.ao" />
        </Field>
      </Section>

      <Section title="Contactos Telefónicos">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Telefone 1">
            <input value={form.telefone1} onChange={(e) => update('telefone1', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Telefone 2">
            <input value={form.telefone2} onChange={(e) => update('telefone2', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Telefone 3">
            <input value={form.telefone3} onChange={(e) => update('telefone3', e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Localização e Online">
        <Field label="Morada">
          <input value={form.morada} onChange={(e) => update('morada', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Site">
          <input value={form.site} onChange={(e) => update('site', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Facebook">
          <input value={form.facebook} onChange={(e) => update('facebook', e.target.value)} className={inputClass} />
        </Field>
      </Section>

      {saved && (
        <div className="rounded-lg bg-vine/10 border border-vine/20 px-4 py-3 text-sm text-vine-deep">
          Configurações guardadas com sucesso.
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>
      )}

      <button type="submit" disabled={isPending} className="rounded-full bg-vine px-7 py-3 text-sm font-medium text-paper hover:bg-vine-deep transition disabled:opacity-50">
        {isPending ? 'A guardar...' : 'Guardar Configurações'}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-6">
      <h3 className="mb-4 font-medium text-ink">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
