create table if not exists public.voluntaria (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null, email text not null unique,
  perfil text not null check (perfil in ('coordenacao','voluntaria')),
  ativo boolean not null default true
);
create table if not exists public.beneficiaria (
  id uuid primary key, nome text not null, telefone text not null, bairro text not null,
  data_nascimento date not null, situacao_vulnerabilidade text not null,
  necessidades text, criado_em timestamptz not null default now(),
  criado_por uuid not null references public.voluntaria(id)
);
create table if not exists public.atendimento (
  id uuid primary key,
  beneficiaria_id uuid not null references public.beneficiaria(id),
  voluntaria_id uuid not null references public.voluntaria(id),
  data_atendimento timestamptz not null,
  tipo text not null check (tipo in ('acompanhamento','acolhimento','entrega')),
  observacao text
);
alter table public.voluntaria   enable row level security;
alter table public.beneficiaria enable row level security;
alter table public.atendimento  enable row level security;
create policy "voluntaria le o proprio" on public.voluntaria for select using (id = auth.uid());
create policy "leem beneficiarias" on public.beneficiaria for select using (auth.uid() is not null);
create policy "inserem beneficiarias" on public.beneficiaria for insert
  with check (exists (select 1 from public.voluntaria v where v.id = auth.uid() and v.ativo));
create policy "leem atendimentos" on public.atendimento for select using (auth.uid() is not null);
create policy "inserem atendimentos" on public.atendimento for insert
  with check (exists (select 1 from public.voluntaria v where v.id = auth.uid() and v.ativo));