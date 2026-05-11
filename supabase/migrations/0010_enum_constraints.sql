-- Enum CHECK constraints
alter table relationships
  add constraint chk_relationship_type check (
    relationship_type in (
      'investment','customer','supplier','partnership',
      'infrastructure','thematic','speculative'
    )
  ),
  add constraint chk_relationship_strength check (
    relationship_strength in ('direct','indirect','speculative')
  ),
  add constraint chk_hype_risk check (
    hype_risk in ('low','medium','high')
  );

alter table sources
  add constraint chk_source_type check (
    source_type in (
      'sec_filing','earnings_call','official_announcement',
      'reuters','bloomberg','ft','wsj',
      'analyst_report','news_article','blog','community'
    )
  );

-- Numeric range CHECK constraints
alter table sources
  add constraint chk_source_quality_range
  check (source_quality between 0 and 100);

alter table relationships
  add constraint chk_relevance_score_range
  check (relevance_score is null or relevance_score between 0 and 100),
  add constraint chk_revenue_exposure_range
  check (revenue_exposure_pct is null or revenue_exposure_pct between 0 and 100);

alter table score_snapshots
  add constraint chk_score_range
  check (score between 0 and 100);
