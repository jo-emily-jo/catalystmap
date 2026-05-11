create table catalyst_companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  legal_name text,
  country text,
  is_public boolean not null,
  ticker text,
  exchange text,
  short_description text not null,
  thesis_md text not null,
  founded_year int,
  website text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint chk_public_ticker_exchange
    check (not is_public or (ticker is not null and exchange is not null))
);

create index idx_catalyst_companies_slug on catalyst_companies (slug);
create index idx_catalyst_companies_is_active on catalyst_companies (is_active);
