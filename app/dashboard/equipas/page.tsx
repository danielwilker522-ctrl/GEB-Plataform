import { createClient } from '@/lib/supabase/server';
import EquipasClient from './EquipasClient';

export default async function EquipasPage() {
  const supabase = await createClient();

  const [{ data: equipas }, { data: profiles }] = await Promise.all([
    supabase
      .from('equipas')
      .select('*, profiles(nome_completo), equipa_membros(profile_id, profiles(nome_completo))')
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, nome_completo, role')
      .eq('ativo', true)
      .order('nome_completo'),
  ]);

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Equipas</h1>
        <p className="text-sm text-ink/50">Equipas de supervisão e os seus membros</p>
      </div>
      <EquipasClient equipas={equipas ?? []} profiles={profiles ?? []} />
    </div>
  );
}
