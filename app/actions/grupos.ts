'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { EstadoGrupo } from '@/types/database.types';

export async function criarGrupo(input: {
  numero_grupo: string;
  nome_grupo: string;
  responsavel_nome: string;
  responsavel_telefone?: string;
  responsavel_email?: string;
  localizacao?: string;
  bairro?: string;
  municipio?: string;
  provincia?: string;
  supervisor_id?: string;
  equipa_id?: string;
  data_abertura?: string;
  numero_participantes?: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('grupos')
    .insert(input)
    .select()
    .single();

  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/grupos');
  revalidatePath('/dashboard');
  return { success: true as const, data };
}

export async function editarGrupo(id: string, input: Partial<{
  nome_grupo: string;
  responsavel_nome: string;
  responsavel_telefone: string;
  responsavel_email: string;
  localizacao: string;
  bairro: string;
  municipio: string;
  provincia: string;
  supervisor_id: string;
  equipa_id: string;
  numero_participantes: number;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('grupos')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/grupos');
  return { success: true as const, data };
}

export async function alterarEstadoGrupo(id: string, estado: EstadoGrupo, extra?: {
  motivo_inatividade?: string;
  solucao_proposta?: string;
  data_ocorrencia?: string;
  responsavel_acompanhamento?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const update = {
    estado,
    motivo_inatividade: extra?.motivo_inatividade ?? null,
    solucao_proposta: extra?.solucao_proposta ?? null,
    data_ocorrencia: extra?.data_ocorrencia ?? null,
    responsavel_acompanhamento:
      extra?.responsavel_acompanhamento ?? (estado === 'inativo' && user ? user.id : null),
  };

  const { data, error } = await supabase
    .from('grupos')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/grupos');
  revalidatePath('/dashboard');
  return { success: true as const, data };
}
