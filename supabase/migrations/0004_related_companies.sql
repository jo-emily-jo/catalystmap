create table related_companies (
  id uuid primary key default gen_random_uuid(),
  ticker text not null,
  exchange text not null,
  name text not null,
  country text,
  sector text,
  industry text,
  market_cap_usd bigint,
  short_description text,
  website text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uq_related_companies_ticker_exchange unique (ticker, exchange)
);

create index idx_related_companies_ticker on related_companies (ticker);
create index idx_related_companies_sector on related_companies (sector);
