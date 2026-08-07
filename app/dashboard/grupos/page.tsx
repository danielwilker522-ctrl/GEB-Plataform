import { createClient } from '@/lib/supabase/server';
import GruposTable from './GruposTable';
import Link from 'next/link';

export default async function GruposPage() {
  const supabase = await createClient();

  const [{ data: grupos }, { data: supervisores }] = await Promise.all([
    supabase
      .from('grupos')
      .select('*, supervisores(profile_id, profiles(nome_completo))')
      .order('created_at', { ascending: false }),
    supabase
      .from('supervisores')
      .select('id, profiles(nome_completo)')
      .eq('ativo', true),
  ]);

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Grupos</h1>
          <p className="text-sm text-ink/50">Gestão de todos os grupos de estudo bíblico</p>
        </div>
        <Link
          href="/dashboard/grupos/novo"
          className="rounded-full bg-vine px-5 py-2.5 text-sm font-medium text-paper hover:bg-vine-deep transition"
        >
          + Adicionar Grupo
        </Link>
      </div>

      <GruposTable grupos={grupos ?? []} supervisores={supervisores ?? []} />
    </div>
  );
}
