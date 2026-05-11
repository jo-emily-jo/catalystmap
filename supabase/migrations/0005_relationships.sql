create table relationships (
  id uuid primary key default gen_random_uuid(),
  catalyst_id uuid not null references catalyst_companies (id) on delete cascade,
  related_company_id uuid not null references related_companies (id) on delete cascade,
  relationship_type text not null,
  relationship_strength text not null,
  summary text not null,
  revenue_exposure_pct numeric(5,2),
  first_observed_at date,
  last_verified_at date not null,
  is_active boolean not null default true,
  relevance_score numeric(5,2),
  score_version int,
  hype_risk text not null default 'low',
  curator_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_relationships_catalyst_related
    unique (catalyst_id, related_company_id)
);

create index idx_relationships_catalyst_score
  on relationships (catalyst_id, relevance_score desc);
create index idx_relationships_related_company_id
  on relationships (related_company_id);
create index idx_relationships_is_active
  on relationships (is_active);
