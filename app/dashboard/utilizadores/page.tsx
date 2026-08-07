import { createClient } from '@/lib/supabase/server';
import UtilizadoresClient from './UtilizadoresClient';

export default async function UtilizadoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Utilizadores</h1>
        <p className="text-sm text-ink/50">Gestão de perfis e permissões de acesso</p>
      </div>
      <UtilizadoresClient profiles={profiles ?? []} currentUserId={user?.id ?? ''} />
    </div>
  );
}
