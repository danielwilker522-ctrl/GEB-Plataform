import { createClient } from '@/lib/supabase/server';
import RelatoriosClient from './RelatoriosClient';

export default async function RelatoriosPage() {
  const supabase = await createClient();

  const [
    { data: grupos },
    { data: supervisoes },
    { data: pedidos },
  ] = await Promise.all([
    supabase.from('grupos').select('id, nome_grupo, estado, municipio, provincia, created_at, numero_participantes'),
    supabase.from('supervisoes').select('id, data_visita, grupo_id, supervisor_id, supervisores(profiles(nome_completo))').order('data_visita', { ascending: false }),
    supabase.from('pedidos_abertura').select('id, estado, created_at, municipio'),
  ]);

  // Calcular estatísticas
  const totalGrupos = grupos?.length ?? 0;
  const ativos = grupos?.filter((g) => g.estado === 'ativo').length ?? 0;
  const inativos = grupos?.filter((g) => g.estado === 'inativo').length ?? 0;
  const emAcompanhamento = grupos?.filter((g) => g.estado === 'em_acompanhamento').length ?? 0;
  const encerrados = grupos?.filter((g) => g.estado === 'encerrado').length ?? 0;

  const inicioMes = new Date(); inicioMes.setDate(1); inicioMes.setHours(0,0,0,0);
  const novosMes = grupos?.filter((g) => new Date(g.created_at) >= inicioMes).length ?? 0;

  // Grupos por município
  const porMunicipio = grupos?.reduce((acc: Record<string, number>, g) => {
    const m = g.municipio ?? 'Desconhecido';
    acc[m] = (acc[m] ?? 0) + 1;
    return acc;
  }, {}) ?? {};

  // Supervisões por mês (últimos 6 meses)
  const supervisoesPorMes: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supervisoes?.forEach((s: any) => {
    const mes = new Date(s.data_visita).toLocaleDateString('pt-AO', { month: 'short', year: 'numeric' });
    supervisoesPorMes[mes] = (supervisoesPorMes[mes] ?? 0) + 1;
  });

  const stats = { totalGrupos, ativos, inativos, emAcompanhamento, encerrados, novosMes };

  return (
    <div className="px-6 py-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Relatórios</h1>
        <p className="text-sm text-ink/50">Estatísticas e dados do departamento GEB</p>
      </div>
      <RelatoriosClient
        stats={stats}
        porMunicipio={porMunicipio}
        supervisoesPorMes={supervisoesPorMes}
        grupos={grupos ?? []}
        supervisoes={supervisoes ?? []}
        pedidos={pedidos ?? []}
      />
    </div>
  );
}
