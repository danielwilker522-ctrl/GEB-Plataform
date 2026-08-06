"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email ou palavra-passe incorretos.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl font-semibold text-gold">GEB</p>
          <p className="mt-1 text-sm text-paper/50">Área Administrativa</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-line-dark bg-night-soft p-8">
          <h1 className="mb-6 font-display text-xl text-paper">Entrar</h1>

          <label className="block">
            <span className="mb-1.5 block text-sm text-paper/60">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line-dark bg-night px-4 py-3 text-paper placeholder:text-paper/25 focus:border-gold focus:outline-none"
              placeholder="admin@geb.exemplo"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm text-paper/60">Palavra-passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line-dark bg-night px-4 py-3 text-paper placeholder:text-paper/25 focus:border-gold focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-clay/20 px-4 py-3 text-sm text-clay">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full rounded-full bg-vine px-6 py-3.5 text-sm font-medium text-paper transition hover:bg-vine-deep disabled:opacity-60"
          >
            {isPending ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-paper/30">
          GEB — Grupo de Estudo Bíblico · Ministério El Shalom
        </p>
      </div>
    </div>
  );
}
