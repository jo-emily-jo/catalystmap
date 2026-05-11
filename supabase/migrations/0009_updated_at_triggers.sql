create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_themes_updated_at
  before update on themes
  for each row execute function update_updated_at_column();

create trigger trg_catalyst_companies_updated_at
  before update on catalyst_companies
  for each row execute function update_updated_at_column();

create trigger trg_related_companies_updated_at
  before update on related_companies
  for each row execute function update_updated_at_column();

create trigger trg_relationships_updated_at
  before update on relationships
  for each row execute function update_updated_at_column();
