# SaaS Empresarial

Sistema web multiempresa (multi-tenant) com login proprio, dashboard, financeiro,
automacoes, monitoramento de concorrentes e um assistente de IA que responde com
base nos dados reais da empresa.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + RLS) · Recharts · OpenAI/Groq

## Modulos

| Rota | Modulo |
|---|---|
| `/login`, `/cadastro` | Autenticacao (Supabase Auth) |
| `/dashboard` | Cards de KPI + graficos (receita, despesas, novos clientes) |
| `/clientes` e `/clientes/[id]` | CRM: cadastro, busca, filtros e detalhes |
| `/financeiro` | Lancamentos de receita/despesa + resultado |
| `/financeiro/faturamento` | Contas a vencer agrupadas por prazo |
| `/automacoes` | Automacoes com gatilho/acao, ativar e pausar |
| `/concorrentes` | Monitoramento de precos e posicionamento |
| `/calendario` | Contas e renovacoes dos proximos 3 meses |
| `/relatorios` | Consolidado de 12 meses |
| `/chat-ia` | Assistente com contexto dos dados da empresa |

## Como rodar

### 1. Supabase

1. Crie um projeto em <https://supabase.com>.
2. Abra **SQL Editor**, cole todo o conteudo de `supabase/schema.sql` e execute.
   Isso cria as 7 tabelas, as politicas de **Row Level Security** (cada empresa so
   ve os proprios dados) e o trigger que cria a empresa + usuario + automacoes
   padrao quando alguem se cadastra.
3. Em **Project Settings → API**, copie `Project URL`, `anon public` e `service_role`.
4. (Opcional) Em **Authentication → URL Configuration**, adicione
   `http://localhost:3000/**` e `https://SEU-DOMINIO.vercel.app/**` como Redirect URLs.

### 2. Projeto local

```bash
npm install
cp .env.local.example .env.local   # preencha as chaves
npm run dev
```

Acesse <http://localhost:3000>, clique em **Criar empresa** e cadastre-se.

### 3. Variaveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=sk-...        # opcional
OPENAI_MODEL=gpt-4o-mini
GROQ_API_KEY=gsk_...         # opcional (gratuito)
AI_PROVIDER=auto             # auto | openai | groq | forced
```

- `AI_PROVIDER=auto` usa OpenAI se existir chave, senao Groq, senao modo local.
- `AI_PROVIDER=forced` responde com os dados da empresa **sem** chamar IA externa
  (util para demonstrar/depurar sem custo).

### 4. Deploy na Vercel

1. Suba o projeto para um repositorio GitHub.
2. Importe na <https://vercel.com> e cadastre as mesmas variaveis em
   **Settings → Environment Variables**.
3. Deploy.

## Arquitetura

```
saas-empresarial/
├── app/
│   ├── (auth)/            # login e cadastro
│   ├── (dashboard)/       # area logada (layout com menu lateral)
│   └── api/               # chat, clientes, financeiro, automacoes, dashboard
├── components/            # ui, dashboard, clientes, financeiro, automacoes, chat
├── lib/
│   ├── supabase/          # client browser, client server, middleware de sessao
│   ├── ai/                # contexto da empresa + provider (OpenAI/Groq/local)
│   ├── queries.ts         # metricas do dashboard
│   └── api-guard.ts       # autenticacao + empresa nas rotas de API
├── middleware.ts          # protege as rotas privadas
├── supabase/schema.sql    # banco + RLS + trigger de onboarding
└── types/index.ts         # tipos do dominio
```

## Seguranca

- Toda tabela tem **RLS ativo**. As policies usam `empresa_do_usuario()`,
  uma funcao `security definer` que resolve o `empresa_id` do usuario logado.
- As rotas de API sempre filtram por `empresa_id` e nunca confiam no cliente.
- O middleware renova a sessao e redireciona usuarios anonimos para `/login`.

## Proximos passos sugeridos

- Conectar o n8n (ou Supabase Edge Functions) para executar as automacoes de fato.
- Adicionar convite de usuarios da mesma empresa.
- Integrar Stripe para os planos free/pro/enterprise.
- Upload de documentos no Supabase Storage.
