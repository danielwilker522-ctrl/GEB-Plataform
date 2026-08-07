import { createClient } from '@/lib/supabase/server';
import GrupoForm from '../GrupoForm';

export default async function NovoGrupoPage() {
  const supabase = await createClient();
  const { data: supervisores } = await supabase
    .from('supervisores')
    .select('id, profiles(nome_completo)')
    .eq('ativo', true);

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <a href="/dashboard/grupos" className="text-sm text-vine hover:underline">← Grupos</a>
        <h1 className="mt-2 font-display text-2xl text-ink">Adicionar Grupo</h1>
      </div>
      <div className="max-w-2xl">
        <GrupoForm supervisores={supervisores ?? []} modo="criar" />
      </div>
    </div>
  );
}
