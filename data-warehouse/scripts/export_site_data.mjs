import fs from 'node:fs';
import path from 'node:path';

const SITE = process.cwd();
const WAREHOUSE = path.join(SITE, 'data-warehouse');
const TARGETS = [path.join(SITE, 'public', 'data'), path.join(SITE, 'src', 'data')];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += ch;
    } else {
      if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
      else field += ch;
    }
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  while (rows.length && rows[rows.length - 1].every(v => v === '')) rows.pop();
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.replace(/^\uFEFF/, ''));
  return rows.slice(1).filter(r => r.some(v => v !== '')).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function readCsv(relativePath) {
  return parseCsv(fs.readFileSync(path.join(WAREHOUSE, relativePath), 'utf8'));
}

function writeJson(filename, data) {
  const payload = JSON.stringify(data, null, 2) + '\n';
  for (const out of TARGETS) {
    fs.mkdirSync(out, { recursive: true });
    const destination = path.join(out, filename);
    fs.writeFileSync(destination, payload, 'utf8');
    console.log('wrote', destination);
  }
}

const int = v => Number.parseInt(v, 10);
const nullableInt = v => v === '' || v == null ? null : int(v);
const num = v => Number(v);
const nullableNum = v => v === '' || v == null ? null : num(v);

const councillors = readCsv('data/dim_councillor.csv').map(row => ({
  ...row,
  ward_number: row.ward_number ? int(row.ward_number) : null,
  current_member: String(row.current_member).toLowerCase() === 'true',
}));
writeJson('councillors.json', councillors);

writeJson('topics.json', readCsv('config/topic_taxonomy.csv'));

const overview = readCsv('data/facts/fact_budget_overview.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  gross_operating_expenditure_cad: int(row.gross_operating_expenditure_cad),
  taxation_revenue_cad: int(row.taxation_revenue_cad),
}));
writeJson('budget-overview.json', overview);

const departments = readCsv('data/facts/fact_department_reported.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  amount_cad: int(row.amount_cad),
}));
writeJson('budget-departments-reported.json', departments);

const reconciliation = readCsv('data/reconciliation.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  published_total_cad: int(row.published_total_cad),
  extracted_department_sum_cad: int(row.extracted_department_sum_cad),
  difference_cad: int(row.difference_cad),
}));
writeJson('budget-reconciliation.json', reconciliation);

const crosswalk = readCsv('data/dim_department_crosswalk.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  confidence: num(row.confidence),
}));
writeJson('department-crosswalk.json', crosswalk);

const taxDrivers = readCsv('data/facts/fact_tax_levy_driver_2026.csv').map(row => ({
  ...row,
  order_key: int(row.order_key),
  amount_cad: int(row.amount_cad),
  impact_pct_of_2025_levy: num(row.impact_pct_of_2025_levy),
}));
writeJson('tax-drivers-2026.json', taxDrivers);

const taxDriverDetail = readCsv('data/facts/fact_tax_levy_driver_detail_2026.csv').map(row => ({
  ...row,
  amount_cad: int(row.amount_cad),
  impact_pct_of_2025_levy: num(row.impact_pct_of_2025_levy),
}));
writeJson('tax-driver-detail-2026.json', taxDriverDetail);

const serviceRequirements = readCsv('data/facts/fact_service_net_requirement.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  amount_cad: int(row.amount_cad),
}));
writeJson('service-net-requirements.json', serviceRequirements);

const serviceTaxLevy2026 = readCsv('data/facts/fact_service_tax_levy_2026.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  net_requirement_before_indirect_revenues_cad: int(row.net_requirement_before_indirect_revenues_cad),
  allocated_indirect_revenue_cad: int(row.allocated_indirect_revenue_cad),
  net_tax_levy_cad: int(row.net_tax_levy_cad),
}));
writeJson('service-tax-levy-2026.json', serviceTaxLevy2026);

const outcomeSources = Object.fromEntries(readCsv('data/source_manifest.csv').map(r => [r.source_id, r]));
const outcomeDomains = readCsv('data/dim_outcome_domain.csv').map(row => ({
  ...row,
  order_key: int(row.order_key),
  linked_service_id: row.linked_service_id || null,
}));
const outcomeMetrics = readCsv('data/facts/fact_outcome_metric.csv').map(row => {
  const src = outcomeSources[row.source_id] ?? {};
  return {
    ...row,
    value: num(row.value),
    source_url: src.canonical_url || null,
    source_name: src.document_name || null,
  };
});
const outcomeTrends = readCsv('data/facts/fact_outcome_trend.csv');
writeJson('outcomes.json', { domains: outcomeDomains, metrics: outcomeMetrics, trends: outcomeTrends });

const dataQualityNotes = readCsv('data/facts/fact_data_quality_note.csv').map(row => {
  const primary = outcomeSources[row.primary_source_id] ?? {};
  const secondary = outcomeSources[row.secondary_source_id] ?? {};
  return {
    ...row,
    primary_source_url: primary.canonical_url || null,
    primary_source_name: primary.document_name || null,
    secondary_source_url: secondary.canonical_url || null,
    secondary_source_name: secondary.document_name || null,
  };
});
writeJson('data-quality-notes.json', dataQualityNotes);

const legacy = readCsv('data/facts/fact_legacy_2026.csv').map(row => ({ ...row, amount_cad: int(row.amount_cad) }));
writeJson('legacy-2026.json', legacy);

const legacyReserve = readCsv('data/facts/fact_legacy_reserve_history.csv').map(row => ({
  ...row,
  reserve_balance_cad: int(row.reserve_balance_cad),
  commitments_cad: int(row.commitments_cad),
  uncommitted_cad: int(row.uncommitted_cad),
}));
writeJson('legacy-reserve-history.json', legacyReserve);

const legacyOffsets = readCsv('data/facts/fact_legacy_levy_offsets.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  amount_cad: int(row.amount_cad),
  component_count: int(row.component_count),
  known_tax_rate_effect_pct_points: nullableNum(row.known_tax_rate_effect_pct_points),
  follow_on_year: nullableInt(row.follow_on_year),
}));
writeJson('legacy-levy-offset-history.json', legacyOffsets);

const publicWorks = readCsv('data/facts/fact_public_works_components.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  amount_cad: int(row.amount_cad),
  total_net_requirement_cad: int(row.total_net_requirement_cad),
}));
writeJson('public-works-components.json', publicWorks);

const publicWorksAnnotations = readCsv('data/facts/fact_public_works_annotations.csv').map(row => ({
  ...row,
  effective_year: int(row.effective_year),
  amount_cad: int(row.amount_cad),
}));
writeJson('public-works-annotations.json', publicWorksAnnotations);


const strongMayorActions = readCsv('data/facts/fact_strong_mayor_action.csv').map(row => ({
  ...row,
  related_motion_ids: (row.related_motion_ids || '').split('|').filter(Boolean),
}));
writeJson('strong-mayor-actions.json', strongMayorActions);

const budget = readCsv('data/seed/stg_budget_seed.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  amount_cad: int(row.amount_cad),
  source_page: nullableInt(row.source_page),
}));
writeJson('budget-seed.json', budget);

const actuals = readCsv('data/seed/stg_actuals_2024_seed.csv').map(row => ({
  ...row,
  fiscal_year: int(row.fiscal_year),
  budget_amount_cad: int(row.budget_amount_cad),
  actual_amount_cad: int(row.actual_amount_cad),
  prior_actual_amount_cad: int(row.prior_actual_amount_cad),
  source_page: nullableInt(row.source_page),
}));
writeJson('actuals-2024-seed.json', actuals);

// Build public vote payload from normalized motion + member-vote facts.
const motions = readCsv('data/facts/fact_motion.csv');
const memberVotes = readCsv('data/facts/fact_vote.csv');
const sources = Object.fromEntries(readCsv('data/source_manifest.csv').map(r => [r.source_id, r]));
const votesByMotion = new Map();
for (const row of memberVotes) {
  if (!votesByMotion.has(row.motion_id)) votesByMotion.set(row.motion_id, []);
  votesByMotion.get(row.motion_id).push({ member: row.member, vote: row.vote });
}
const asInt = (value, fallback = 0) => value == null || value === '' ? fallback : int(value);
const votesPayload = motions.map(m => {
  const src = sources[m.source_id] ?? {};
  return {
    id: m.motion_id,
    meeting_date: m.meeting_date,
    meeting_date_display: m.meeting_date_display,
    meeting_type: m.meeting_type,
    decision_stage: m.decision_stage,
    title: m.title,
    summary: m.summary,
    motion_text: m.motion_text ?? '',
    mover: m.mover,
    result: m.result,
    yes_count: asInt(m.yes_count),
    no_count: asInt(m.no_count),
    conflict_count: asInt(m.conflict_count),
    absent_count: asInt(m.absent_count),
    topic_ids: (m.topic_ids ?? '').split('|').filter(Boolean),
    primary_topic_id: m.primary_topic_id,
    financial_impact: {
      status: m.financial_status,
      amount_cad: nullableInt(m.financial_amount_cad),
      direction: m.financial_direction || null,
      timing: m.financial_timing || null,
      funding_source: m.funding_source || null,
    },
    votes: votesByMotion.get(m.motion_id) ?? [],
    source_id: m.source_id,
    source_url: m.source_url,
    source_label: src.source_type === 'council_minutes' ? 'Official City of Peterborough minutes' : (src.document_name || 'Official City source'),
    review_status: m.review_status,
    significance: (m.significance ?? '').split('|').filter(Boolean),
    notes: m.notes ?? '',
  };
});
votesPayload.sort((a, b) => b.meeting_date.localeCompare(a.meeting_date) || b.id.localeCompare(a.id));
fs.writeFileSync(path.join(WAREHOUSE, 'data', 'published_votes.json'), JSON.stringify(votesPayload, null, 2) + '\n', 'utf8');
console.log('wrote', path.join(WAREHOUSE, 'data', 'published_votes.json'), `(${votesPayload.length} motions)`);
writeJson('votes.json', votesPayload);

writeJson('metadata.json', {
  product: 'Peterborough By The Numbers',
  status: 'pre-release-audit-pass-11',
  scope: 'Plain-language presentation layer over budgets 2022-2026, recorded Council votes and current outcome signals through 2025/2026',
  budgetSeriesCount: new Set(serviceRequirements.map(row => row.service_id)).size,
  verifiedMotionCount: votesPayload.length,
  strongMayorActionCount: strongMayorActions.length,
  outcomeMetricCount: outcomeMetrics.length,
  dataQualityNoteCount: dataQualityNotes.length,
  budgetDataStatus: 'Approved/final 2022-2026 backbone loaded; service trends use Net Requirement Before Indirect Revenues. A 2026 accounting bridge now distinguishes that measure from Allocated Indirect Revenue and Net Tax Levy. The City publication-level 2026 operating-total discrepancy is explicitly flagged.',
  voteDataStatus: `${votesPayload.length} significant recorded motions are source-linked to official City minutes. The September 20 pre-release review corrected the 2024 homelessness funding package from four item-level records to the single 9-1 package vote shown in the official minutes.`,
  outcomeDataStatus: 'Freshness-first KPI layer leads with 2025 annual actuals published in 2026. The 2025 Peterborough CMA crime-rate change now uses Statistics Canada’s published +1% annual change rather than a calculation from rounded displayed rates.',
  authoritativeSourcePolicy: 'Official City of Peterborough, Peterborough Police Service, Statistics Canada and other primary-government sources are authoritative for their respective measures.',
  correctionPolicy: 'Material corrections are logged publicly at /data/methodology with source links and review dates.',
  lastBuilt: '2026-09-20',
});
