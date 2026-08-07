import { createClient } from '@/lib/supabase/server';
import PedidosTable from './PedidosTable';

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: pedidos } = await supabase
    .from('pedidos_abertura')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Pedidos de Abertura</h1>
        <p className="text-sm text-ink/50">
          Solicitações recebidas pelo formulário público
        </p>
      </div>
      <PedidosTable pedidos={pedidos ?? []} />
    </div>
  );
}
