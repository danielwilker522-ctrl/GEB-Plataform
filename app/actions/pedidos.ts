'use server';

import { createClient } from '@/lib/supabase/server';
import type { PedidoAbertura } from '@/types/database.types';

export type NovoPedidoInput = Omit<
  PedidoAbertura,
  'id' | 'estado' | 'motivo_rejeicao' | 'revisto_por' | 'revisto_em' | 'created_at'
>;

export async function submeterPedidoAbertura(input: NovoPedidoInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pedidos_abertura')
    .insert({
      nome_completo: input.nome_completo,
      telefone: input.telefone,
      email: input.email,
      localizacao: input.localizacao,
      bairro: input.bairro,
      municipio: input.municipio,
      provincia: input.provincia,
      numero_participantes: input.numero_participantes,
      dias_disponiveis: input.dias_disponiveis,
      horario: input.horario,
      observacoes: input.observacoes,
    })
    .select()
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const, data };
}

// Usado na Dashboard para aprovar/rejeitar (requer login com role admin/secretario)
export async function atualizarEstadoPedido(
  id: string,
  estado: 'aprovado' | 'rejeitado',
  motivoRejeicao?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('pedidos_abertura')
    .update({
      estado,
      motivo_rejeicao: motivoRejeicao ?? null,
      revisto_por: user?.id,
      revisto_em: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  // Nota: se estado = 'aprovado', o trigger no Supabase cria
  // automaticamente o registo em `grupos`.
  return { success: true as const, data };
}
