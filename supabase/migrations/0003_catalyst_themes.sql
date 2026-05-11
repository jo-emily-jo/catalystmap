create table catalyst_themes (
  catalyst_id uuid not null references catalyst_companies (id) on delete cascade,
  theme_id uuid not null references themes (id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),

  primary key (catalyst_id, theme_id)
);

create index idx_catalyst_themes_theme_id on catalyst_themes (theme_id);
