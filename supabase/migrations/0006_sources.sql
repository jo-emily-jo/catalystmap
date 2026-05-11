create table sources (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references relationships (id) on delete cascade,
  url text not null,
  title text,
  source_type text not null,
  source_quality int not null,
  published_at date,
  accessed_at timestamptz not null,
  excerpt text,
  created_at timestamptz not null default now()
);

create index idx_sources_relationship_id on sources (relationship_id);
create index idx_sources_published_at on sources (published_at desc);
