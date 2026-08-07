import { createClient } from '@/lib/supabase/server';
import ConfiguracoesClient from './ConfiguracoesClient';

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: configs } = await supabase.from('configuracoes').select('*');

  const cfg = configs?.reduce((acc: Record<string, Record<string, unknown>>, c) => {
    acc[c.chave] = c.valor as Record<string, unknown>;
    return acc;
  }, {}) ?? {};

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Configurações</h1>
        <p className="text-sm text-ink/50">Dados e informações do departamento</p>
      </div>
      <ConfiguracoesClient config={cfg} />
    </div>
  );
}
