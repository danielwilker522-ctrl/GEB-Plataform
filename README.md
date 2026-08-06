# GEB - Sistema de Gestão do Grupo de Estudo Bíblico

Landing page institucional + Dashboard administrativa. Next.js (App Router) + Supabase.

## Deploy (Vercel)

1. Importar este repositório em vercel.com/new
2. Em Environment Variables, adicionar:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Deploy

## Desenvolvimento local

```bash
npm install
cp .env.local.example .env.local   # preencher com a anon key real
npm run dev
```

## Base de dados

Schema completo (tabelas, enums, RLS, triggers) em `supabase_schema.sql`.
Correr no SQL Editor do projeto Supabase (scxqyntprpyofpautmuv).

## Estrutura

- `app/actions/pedidos.ts` — Server Actions (formulário de abertura + aprovação/rejeição)
- `lib/supabase/client.ts` — cliente Supabase (Client Components)
- `lib/supabase/server.ts` — cliente Supabase (Server Components/Actions)
- `lib/supabase/middleware.ts` + `middleware.ts` — sessão + proteção de `/dashboard/*`
- `types/database.types.ts` — types do schema
