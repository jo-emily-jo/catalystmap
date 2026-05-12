alter table relationships
  add column contract_value_usd numeric(18,2),
  add column is_government_procurement boolean not null default false;

create index idx_relationships_is_gov_proc
  on relationships (is_government_procurement)
  where is_government_procurement = true;
