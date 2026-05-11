-- Enable RLS on all tables
alter table themes enable row level security;
alter table catalyst_companies enable row level security;
alter table catalyst_themes enable row level security;
alter table related_companies enable row level security;
alter table relationships enable row level security;
alter table sources enable row level security;
alter table score_snapshots enable row level security;

-- Anon SELECT policies
create policy "anon_select_themes"
  on themes for select to anon using (true);

create policy "anon_select_catalyst_companies"
  on catalyst_companies for select to anon using (is_active = true);

create policy "anon_select_catalyst_themes"
  on catalyst_themes for select to anon using (
    exists (
      select 1 from catalyst_companies
      where catalyst_companies.id = catalyst_themes.catalyst_id
        and catalyst_companies.is_active = true
    )
  );

create policy "anon_select_related_companies"
  on related_companies for select to anon using (true);

create policy "anon_select_relationships"
  on relationships for select to anon using (is_active = true);

create policy "anon_select_sources"
  on sources for select to anon using (true);

create policy "anon_select_score_snapshots"
  on score_snapshots for select to anon using (true);
