import { createClient } from '@/lib/supabase/server';
import GrupoForm from '../../GrupoForm';
import { notFound } from 'next/navigation';

export default async function EditarGrupoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: grupo }, { data: supervisores }] = await Promise.all([
    supabase.from('grupos').select('*').eq('id', id).single(),
    supabase.from('supervisores').select('id, profiles(nome_completo)').eq('ativo', true),
  ]);

  if (!grupo) notFound();

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <a href="/dashboard/grupos" className="text-sm text-vine hover:underline">← Grupos</a>
        <h1 className="mt-2 font-display text-2xl text-ink">Editar Grupo</h1>
        <p className="text-sm text-ink/50">{grupo.nome_grupo}</p>
      </div>
      <div className="max-w-2xl">
        <GrupoForm supervisores={supervisores ?? []} modo="editar" grupo={grupo} />
      </div>
    </div>
  );
}
