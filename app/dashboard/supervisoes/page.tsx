import { createClient } from '@/lib/supabase/server';
import SupervisoesClient from './SupervisoesClient';

export default async function SupervisoesPage() {
  const supabase = await createClient();

  const [{ data: supervisores }, { data: supervisoes }, { data: grupos }] = await Promise.all([
    supabase
      .from('supervisores')
      .select('id, area, contacto, ativo, profiles(nome_completo, email), equipas(nome)')
      .order('created_at', { ascending: false }),
    supabase
      .from('supervisoes')
      .select('*, grupos(nome_grupo, municipio), supervisores(profiles(nome_completo))')
      .order('data_visita', { ascending: false })
      .limit(50),
    supabase
      .from('grupos')
      .select('id, nome_grupo, municipio')
      .eq('estado', 'ativo')
      .order('nome_grupo'),
  ]);

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Supervisões</h1>
        <p className="text-sm text-ink/50">Supervisores e histórico de visitas aos grupos</p>
      </div>
      <SupervisoesClient
        supervisores={supervisores ?? []}
        supervisoes={supervisoes ?? []}
        grupos={grupos ?? []}
      />
    </div>
  );
}
