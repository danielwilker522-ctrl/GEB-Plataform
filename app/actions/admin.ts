'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { UserRole } from '@/types/database.types';

// ─── SUPERVISORES ───────────────────────────────────────────

export async function criarSupervisor(input: {
  profile_id: string;
  area?: string;
  equipa_id?: string;
  contacto?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('supervisores')
    .insert(input)
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/supervisoes');
  return { success: true as const, data };
}

export async function editarSupervisor(id: string, input: {
  area?: string;
  equipa_id?: string;
  contacto?: string;
  ativo?: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('supervisores')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/supervisoes');
  return { success: true as const, data };
}

// ─── EQUIPAS ────────────────────────────────────────────────

export async function criarEquipa(input: {
  nome: string;
  coordenador_id?: string;
  descricao?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('equipas')
    .insert(input)
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/equipas');
  return { success: true as const, data };
}

export async function editarEquipa(id: string, input: {
  nome?: string;
  coordenador_id?: string;
  descricao?: string;
  ativo?: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('equipas')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/equipas');
  return { success: true as const, data };
}

// ─── UTILIZADORES ───────────────────────────────────────────

export async function atualizarRole(id: string, role: UserRole) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/utilizadores');
  return { success: true as const, data };
}

export async function toggleAtivoUtilizador(id: string, ativo: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ ativo })
    .eq('id', id)
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/utilizadores');
  return { success: true as const, data };
}

// ─── CONFIGURAÇÕES ───────────────────────────────────────────

export async function salvarConfiguracao(chave: string, valor: Record<string, unknown>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('configuracoes')
    .upsert({ chave, valor, updated_by: user?.id, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/configuracoes');
  return { success: true as const, data };
}

// ─── SUPERVISÕES ─────────────────────────────────────────────

export async function registarSupervisao(input: {
  grupo_id: string;
  supervisor_id: string;
  data_visita: string;
  relatorio?: string;
  proxima_visita?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('supervisoes')
    .insert(input)
    .select()
    .single();
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/dashboard/supervisoes');
  revalidatePath('/dashboard/grupos');
  return { success: true as const, data };
}
