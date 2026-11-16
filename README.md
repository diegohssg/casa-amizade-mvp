# Casa da Amizade de Manhacu - MVP (Angular 17 + PWA + Supabase)

## Rodar em modo demo (sem backend)
npm install
ng serve
# http://localhost:4200 - login demo: qualquer e-mail + senha (min 4)

## Rodar com Supabase real
1. Crie projeto em supabase.com e rode supabase/schema.sql no SQL Editor
2. Crie usuario em Authentication e insira em public.voluntaria com o mesmo id
3. Coloque supabaseUrl/supabaseAnonKey nos arquivos de environment e mude demo para false
4. npm run build e publique na Vercel (PWA so ativa em HTTPS/producao)