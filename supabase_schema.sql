-- ============================================================
-- SISTEMA DE GESTÃO DO GEB - SCHEMA SUPABASE (PostgreSQL)
-- ============================================================
-- Como aplicar:
--   1. Supabase Dashboard > SQL Editor > cola este ficheiro > Run
--   2. Ou via CLI: supabase db push (colocando isto em supabase/migrations/)
-- ============================================================


-- ============================================================
-- 1. ENUMS
-- ============================================================

create type user_role as enum (
  'admin_geral',
  'admin_geb',
  'supervisor',
  'secretario',
  'visitante'
);

create type estado_pedido as enum (
  'pendente',
  'aprovado',
  'rejeitado'
);

create type estado_grupo as enum (
  'ativo',
  'em_acompanhamento',
  'inativo',
  'encerrado'
);


-- ============================================================
-- 2. PROFILES (estende auth.users do Supabase)
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text not null,
  telefone text,
  email text,
  avatar_url text,
  role user_role not null default 'visitante',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfis de utilizadores do sistema, ligados ao auth.users do Supabase';

-- Trigger: cria automaticamente um profile quando um utilizador se regista
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome_completo, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome_completo', new.email), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- 3. EQUIPAS
-- ============================================================

create table public.equipas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  coordenador_id uuid references public.profiles(id) on delete set null,
  descricao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Membros de cada equipa (muitos-para-muitos)
create table public.equipa_membros (
  equipa_id uuid references public.equipas(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  data_entrada timestamptz not null default now(),
  primary key (equipa_id, profile_id)
);


-- ============================================================
-- 4. SUPERVISORES (dados extra sobre profiles com role = supervisor)
-- ============================================================

create table public.supervisores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade unique,
  area text, -- ex: "Luanda - Zona Norte"
  equipa_id uuid references public.equipas(id) on delete set null,
  contacto text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);


-- ============================================================
-- 5. PEDIDOS DE ABERTURA (formulário público da landing page)
-- ============================================================

create table public.pedidos_abertura (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  telefone text not null,
  email text,
  localizacao text,
  bairro text,
  municipio text,
  provincia text,
  numero_participantes int,
  dias_disponiveis text[], -- ex: {'segunda','quarta','sexta'}
  horario text,
  observacoes text,
  estado estado_pedido not null default 'pendente',
  motivo_rejeicao text,
  revisto_por uuid references public.profiles(id),
  revisto_em timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.pedidos_abertura is 'Pedidos enviados pelo formulário público de abertura de grupo';


-- ============================================================
-- 6. GRUPOS
-- ============================================================

create table public.grupos (
  id uuid primary key default gen_random_uuid(),
  numero_grupo text unique not null,
  nome_grupo text not null,
  responsavel_nome text not null,
  responsavel_telefone text,
  responsavel_email text,
  localizacao text,
  bairro text,
  municipio text,
  provincia text,
  supervisor_id uuid references public.supervisores(id) on delete set null,
  equipa_id uuid references public.equipas(id) on delete set null,
  data_abertura date not null default current_date,
  estado estado_grupo not null default 'ativo',

  -- Preenchido apenas quando estado = 'inativo'
  motivo_inatividade text,
  solucao_proposta text,
  data_ocorrencia date,
  responsavel_acompanhamento uuid references public.profiles(id),

  numero_participantes int,
  pedido_origem_id uuid references public.pedidos_abertura(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_grupos_estado on public.grupos(estado);
create index idx_grupos_supervisor on public.grupos(supervisor_id);
create index idx_grupos_municipio on public.grupos(municipio);


-- ============================================================
-- 7. SUPERVISÕES (histórico de visitas/acompanhamento a grupos)
-- ============================================================

create table public.supervisoes (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references public.grupos(id) on delete cascade,
  supervisor_id uuid not null references public.supervisores(id) on delete cascade,
  data_visita date not null,
  relatorio text,
  proxima_visita date,
  created_at timestamptz not null default now()
);

create index idx_supervisoes_grupo on public.supervisoes(grupo_id);
create index idx_supervisoes_data on public.supervisoes(data_visita);


-- ============================================================
-- 8. CONFIGURAÇÕES DO DEPARTAMENTO (chave-valor)
-- ============================================================

create table public.configuracoes (
  chave text primary key,
  valor jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

-- Exemplos de chaves: 'dados_departamento', 'logotipo_url', 'contactos', 'redes_sociais'


-- ============================================================
-- 9. FUNÇÕES AUXILIARES (para as políticas RLS)
-- ============================================================

create function public.get_my_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

create function public.is_admin()
returns boolean as $$
  select public.get_my_role() in ('admin_geral', 'admin_geb');
$$ language sql stable security definer;

create function public.my_supervisor_id()
returns uuid as $$
  select id from public.supervisores where profile_id = auth.uid();
$$ language sql stable security definer;


-- ============================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.equipas enable row level security;
alter table public.equipa_membros enable row level security;
alter table public.supervisores enable row level security;
alter table public.pedidos_abertura enable row level security;
alter table public.grupos enable row level security;
alter table public.supervisoes enable row level security;
alter table public.configuracoes enable row level security;

-- ---------- PROFILES ----------
create policy "Utilizador vê o próprio perfil" on public.profiles
  for select using (auth.uid() = id);

create policy "Admins veem todos os perfis" on public.profiles
  for select using (public.is_admin());

create policy "Admin geral gere perfis" on public.profiles
  for all using (public.get_my_role() = 'admin_geral');

-- ---------- PEDIDOS DE ABERTURA ----------
-- Qualquer pessoa (mesmo sem login) pode SUBMETER um pedido pelo site público
create policy "Público pode criar pedidos" on public.pedidos_abertura
  for insert to anon, authenticated
  with check (true);

-- Só admins e secretário podem ver e gerir os pedidos
create policy "Admins e secretário veem pedidos" on public.pedidos_abertura
  for select using (public.get_my_role() in ('admin_geral', 'admin_geb', 'secretario'));

create policy "Admins e secretário atualizam pedidos" on public.pedidos_abertura
  for update using (public.get_my_role() in ('admin_geral', 'admin_geb', 'secretario'));

-- ---------- GRUPOS ----------
create policy "Admins e secretário veem todos os grupos" on public.grupos
  for select using (public.get_my_role() in ('admin_geral', 'admin_geb', 'secretario', 'visitante'));

create policy "Supervisor vê só os seus grupos" on public.grupos
  for select using (supervisor_id = public.my_supervisor_id());

create policy "Admins gerem grupos" on public.grupos
  for all using (public.get_my_role() in ('admin_geral', 'admin_geb'));

create policy "Secretário atualiza grupos" on public.grupos
  for update using (public.get_my_role() = 'secretario');

-- ---------- SUPERVISÕES ----------
create policy "Admins veem todas as supervisões" on public.supervisoes
  for select using (public.is_admin());

create policy "Supervisor vê as suas supervisões" on public.supervisoes
  for select using (supervisor_id = public.my_supervisor_id());

create policy "Supervisor regista as suas supervisões" on public.supervisoes
  for insert with check (supervisor_id = public.my_supervisor_id());

create policy "Admins gerem supervisões" on public.supervisoes
  for all using (public.is_admin());

-- ---------- EQUIPAS / SUPERVISORES ----------
create policy "Todos autenticados veem equipas" on public.equipas
  for select to authenticated using (true);

create policy "Admins gerem equipas" on public.equipas
  for all using (public.is_admin());

create policy "Todos autenticados veem supervisores" on public.supervisores
  for select to authenticated using (true);

create policy "Admins gerem supervisores" on public.supervisores
  for all using (public.is_admin());

create policy "Todos autenticados veem membros de equipa" on public.equipa_membros
  for select to authenticated using (true);

create policy "Admins gerem membros de equipa" on public.equipa_membros
  for all using (public.is_admin());

-- ---------- CONFIGURAÇÕES ----------
create policy "Todos podem ler configurações" on public.configuracoes
  for select to anon, authenticated using (true);

create policy "Admin geral gere configurações" on public.configuracoes
  for all using (public.get_my_role() = 'admin_geral');


-- ============================================================
-- 11. TRIGGER: aprovar pedido cria automaticamente um grupo
-- ============================================================

create function public.aprovar_pedido_cria_grupo()
returns trigger as $$
begin
  if new.estado = 'aprovado' and old.estado is distinct from 'aprovado' then
    insert into public.grupos (
      numero_grupo, nome_grupo, responsavel_nome, responsavel_telefone,
      responsavel_email, localizacao, bairro, municipio, provincia,
      numero_participantes, pedido_origem_id, estado
    ) values (
      'GEB-' || to_char(now(), 'YYYYMMDD') || '-' || substr(new.id::text, 1, 4),
      'Grupo de ' || new.nome_completo,
      new.nome_completo, new.telefone, new.email,
      new.localizacao, new.bairro, new.municipio, new.provincia,
      new.numero_participantes, new.id, 'ativo'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_pedido_aprovado
  after update on public.pedidos_abertura
  for each row execute procedure public.aprovar_pedido_cria_grupo();


-- ============================================================
-- 12. updated_at automático
-- ============================================================

create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at_grupos before update on public.grupos
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at_equipas before update on public.equipas
  for each row execute procedure public.set_updated_at();
