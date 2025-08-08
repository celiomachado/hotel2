# Setup Supabase CLI

## Instalação
```bash
npm install -g @supabase/cli
```

## Configuração
```bash
# Login no Supabase
supabase login

# Inicializar projeto local
supabase init

# Conectar ao projeto remoto
supabase link --project-ref rxdialhyznmtteztky

# Configurar variáveis de ambiente
echo "SUPABASE_URL=https://rxdialhyznmtteztky.supabase.co" >> .env
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGlhbGhoeXpubXR0ZXp0a2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjA2MjEsImV4cCI6MjA3MDE5NjYyMX0.dBTMs_roLMap7De9zO_tPPxJsjdQ2RFVot0CkiOJ0pI" >> .env
```

## Comandos úteis
```bash
# Ver status do projeto
supabase status

# Sincronizar schema do DB
supabase db pull

# Rodar migrações
supabase db push

# Iniciar ambiente local
supabase start

# Gerar types TypeScript
supabase gen types typescript --local > types/supabase.ts
```

## Credenciais do projeto:
- **Project URL:** https://rxdialhyznmtteztky.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGlhbGhoeXpubXR0ZXp0a2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjA2MjEsImV4cCI6MjA3MDE5NjYyMX0.dBTMs_roLMap7De9zO_tPPxJsjdQ2RFVot0CkiOJ0pI
- **Service Role:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGlhbGhoeXpubXR0ZXp0a2t5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYyMDYyMSwiZXhwIjoyMDcwMTk2NjIxfQ.-Yy32Axkvxy9ML6Kaa79AO9poWZGrbxVKYnSMZ8dpsM
