// ============================================================
// Types gerados a partir do schema Supabase do GEB
// Idealmente, mais tarde substitui por:
//   npx supabase gen types typescript --project-id scxqyntprpyofpautmuv > types/database.types.ts
// ============================================================

export type UserRole =
  | 'admin_geral'
  | 'admin_geb'
  | 'supervisor'
  | 'secretario'
  | 'visitante';

export type EstadoPedido = 'pendente' | 'aprovado' | 'rejeitado';

export type EstadoGrupo = 'ativo' | 'em_acompanhamento' | 'inativo' | 'encerrado';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome_completo: string;
          telefone: string | null;
          email: string | null;
          avatar_url: string | null;
          role: UserRole;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nome_completo: string;
          telefone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };

      equipas: {
        Row: {
          id: string;
          nome: string;
          coordenador_id: string | null;
          descricao: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          coordenador_id?: string | null;
          descricao?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['equipas']['Insert']>;
        Relationships: [];
      };

      equipa_membros: {
        Row: {
          equipa_id: string;
          profile_id: string;
          data_entrada: string;
        };
        Insert: {
          equipa_id: string;
          profile_id: string;
          data_entrada?: string;
        };
        Update: Partial<Database['public']['Tables']['equipa_membros']['Insert']>;
        Relationships: [];
      };

      supervisores: {
        Row: {
          id: string;
          profile_id: string;
          area: string | null;
          equipa_id: string | null;
          contacto: string | null;
          ativo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          area?: string | null;
          equipa_id?: string | null;
          contacto?: string | null;
          ativo?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['supervisores']['Insert']>;
        Relationships: [];
      };

      pedidos_abertura: {
        Row: {
          id: string;
          nome_completo: string;
          telefone: string;
          email: string | null;
          localizacao: string | null;
          bairro: string | null;
          municipio: string | null;
          provincia: string | null;
          numero_participantes: number | null;
          dias_disponiveis: string[] | null;
          horario: string | null;
          observacoes: string | null;
          estado: EstadoPedido;
          motivo_rejeicao: string | null;
          revisto_por: string | null;
          revisto_em: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome_completo: string;
          telefone: string;
          email?: string | null;
          localizacao?: string | null;
          bairro?: string | null;
          municipio?: string | null;
          provincia?: string | null;
          numero_participantes?: number | null;
          dias_disponiveis?: string[] | null;
          horario?: string | null;
          observacoes?: string | null;
          estado?: EstadoPedido;
          motivo_rejeicao?: string | null;
          revisto_por?: string | null;
          revisto_em?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['pedidos_abertura']['Insert']>;
        Relationships: [];
      };

      grupos: {
        Row: {
          id: string;
          numero_grupo: string;
          nome_grupo: string;
          responsavel_nome: string;
          responsavel_telefone: string | null;
          responsavel_email: string | null;
          localizacao: string | null;
          bairro: string | null;
          municipio: string | null;
          provincia: string | null;
          supervisor_id: string | null;
          equipa_id: string | null;
          data_abertura: string;
          estado: EstadoGrupo;
          motivo_inatividade: string | null;
          solucao_proposta: string | null;
          data_ocorrencia: string | null;
          responsavel_acompanhamento: string | null;
          numero_participantes: number | null;
          pedido_origem_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          numero_grupo: string;
          nome_grupo: string;
          responsavel_nome: string;
          responsavel_telefone?: string | null;
          responsavel_email?: string | null;
          localizacao?: string | null;
          bairro?: string | null;
          municipio?: string | null;
          provincia?: string | null;
          supervisor_id?: string | null;
          equipa_id?: string | null;
          data_abertura?: string;
          estado?: EstadoGrupo;
          motivo_inatividade?: string | null;
          solucao_proposta?: string | null;
          data_ocorrencia?: string | null;
          responsavel_acompanhamento?: string | null;
          numero_participantes?: number | null;
          pedido_origem_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['grupos']['Insert']>;
        Relationships: [];
      };

      supervisoes: {
        Row: {
          id: string;
          grupo_id: string;
          supervisor_id: string;
          data_visita: string;
          relatorio: string | null;
          proxima_visita: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          grupo_id: string;
          supervisor_id: string;
          data_visita: string;
          relatorio?: string | null;
          proxima_visita?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['supervisoes']['Insert']>;
        Relationships: [];
      };

      configuracoes: {
        Row: {
          chave: string;
          valor: Record<string, unknown>;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          chave: string;
          valor: Record<string, unknown>;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['configuracoes']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      estado_pedido: EstadoPedido;
      estado_grupo: EstadoGrupo;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Atalhos úteis para importar nos componentes
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Equipa = Database['public']['Tables']['equipas']['Row'];
export type Supervisor = Database['public']['Tables']['supervisores']['Row'];
export type PedidoAbertura = Database['public']['Tables']['pedidos_abertura']['Row'];
export type Grupo = Database['public']['Tables']['grupos']['Row'];
export type Supervisao = Database['public']['Tables']['supervisoes']['Row'];
export type Configuracao = Database['public']['Tables']['configuracoes']['Row'];
