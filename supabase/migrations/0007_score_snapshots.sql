create table score_snapshots (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references relationships (id) on delete cascade,
  score numeric(5,2) not null,
  score_version int not null,
  breakdown jsonb not null,
  computed_at timestamptz not null default now()
);

create index idx_score_snapshots_relationship_computed
  on score_snapshots (relationship_id, computed_at desc);
