"use client";

import { useState, useTransition } from "react";
import { submeterPedidoAbertura, type NovoPedidoInput } from "@/app/actions/pedidos";
import { diasSemana } from "@/lib/site-content";

const initialState = {
  nome_completo: "",
  telefone: "",
  email: "",
  localizacao: "",
  bairro: "",
  municipio: "",
  provincia: "",
  numero_participantes: "",
  horario: "",
  observacoes: "",
};

export default function AbrirGrupoForm() {
  const [form, setForm] = useState(initialState);
  const [dias, setDias] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof typeof initialState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDia(dia: string) {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    const input: NovoPedidoInput = {
      nome_completo: form.nome_completo,
      telefone: form.telefone,
      email: form.email || null,
      localizacao: form.localizacao || null,
      bairro: form.bairro || null,
      municipio: form.municipio || null,
      provincia: form.provincia || null,
      numero_participantes: form.numero_participantes ? Number(form.numero_participantes) : null,
      dias_disponiveis: dias.length ? dias : null,
      horario: form.horario || null,
      observacoes: form.observacoes || null,
    };

    startTransition(async () => {
      const result = await submeterPedidoAbertura(input);
      if (result.success) {
        setStatus("success");
        setForm(initialState);
        setDias([]);
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-vine/30 bg-vine/10 p-10 text-center">
        <p className="font-display text-2xl text-vine-deep">Pedido enviado com sucesso</p>
        <p className="mt-3 text-ink/70">
          Obrigado! A equipa do GEB vai analisar o teu pedido e entrar em
          contacto em breve.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-vine-deep underline underline-offset-4"
        >
          Enviar outro pedido
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Nome completo" required>
        <input
          required
          value={form.nome_completo}
          onChange={(e) => updateField("nome_completo", e.target.value)}
          className={inputClass}
          placeholder="O teu nome"
        />
      </Field>

      <Field label="Telefone" required>
        <input
          required
          value={form.telefone}
          onChange={(e) => updateField("telefone", e.target.value)}
          className={inputClass}
          placeholder="9XX XXX XXX"
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={inputClass}
          placeholder="opcional"
        />
      </Field>

      <Field label="Número aproximado de participantes">
        <input
          type="number"
          min={0}
          value={form.numero_participantes}
          onChange={(e) => updateField("numero_participantes", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Localização">
        <input
          value={form.localizacao}
          onChange={(e) => updateField("localizacao", e.target.value)}
          className={inputClass}
          placeholder="Referência do local"
        />
      </Field>

      <Field label="Bairro">
        <input
          value={form.bairro}
          onChange={(e) => updateField("bairro", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Município">
        <input
          value={form.municipio}
          onChange={(e) => updateField("municipio", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Província">
        <input
          value={form.provincia}
          onChange={(e) => updateField("provincia", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-ink/80">Dias disponíveis</span>
        <div className="flex flex-wrap gap-2">
          {diasSemana.map((dia) => {
            const active = dias.includes(dia);
            return (
              <button
                type="button"
                key={dia}
                onClick={() => toggleDia(dia)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-vine bg-vine text-paper"
                    : "border-line text-ink/70 hover:border-ink/40"
                }`}
              >
                {dia}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Horário">
        <input
          value={form.horario}
          onChange={(e) => updateField("horario", e.target.value)}
          className={inputClass}
          placeholder="Ex: 19h00"
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Observações">
          <textarea
            value={form.observacoes}
            onChange={(e) => updateField("observacoes", e.target.value)}
            rows={4}
            className={inputClass}
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-clay">
          Não foi possível enviar o pedido: {errorMsg}. Tenta novamente.
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-vine px-7 py-4 text-sm font-medium text-paper transition hover:bg-vine-deep disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "A enviar..." : "Enviar Solicitação"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-vine";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-clay"> *</span>}
      </span>
      {children}
    </label>
  );
}
