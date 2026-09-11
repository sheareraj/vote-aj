-- Peterborough By The Numbers dimensional model
-- Intended for DuckDB. Types are deliberately simple and portable.

CREATE TABLE IF NOT EXISTS dim_year (
    year_id INTEGER PRIMARY KEY,
    fiscal_year INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_budget_version (
    budget_version_id VARCHAR PRIMARY KEY,
    version_name VARCHAR NOT NULL,
    is_final BOOLEAN NOT NULL,
    sort_order INTEGER NOT NULL,
    description VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_department (
    department_id VARCHAR PRIMARY KEY,
    canonical_name VARCHAR NOT NULL,
    valid_from INTEGER,
    valid_to INTEGER,
    parent_department_id VARCHAR,
    notes VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_service (
    service_id VARCHAR PRIMARY KEY,
    canonical_name VARCHAR NOT NULL,
    department_id VARCHAR,
    valid_from INTEGER,
    valid_to INTEGER,
    notes VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_account (
    account_id VARCHAR PRIMARY KEY,
    account_name VARCHAR NOT NULL,
    account_group VARCHAR,
    revenue_expense VARCHAR,
    notes VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_funding_source (
    funding_source_id VARCHAR PRIMARY KEY,
    funding_source_name VARCHAR NOT NULL,
    funding_source_group VARCHAR,
    notes VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_topic (
    topic_id VARCHAR PRIMARY KEY,
    topic_name VARCHAR NOT NULL,
    parent_topic_id VARCHAR,
    public_label VARCHAR NOT NULL,
    description VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_councillor (
    councillor_id VARCHAR PRIMARY KEY,
    display_name VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    ward_number INTEGER,
    ward_name VARCHAR,
    term_start DATE,
    term_end DATE,
    current_member BOOLEAN NOT NULL,
    source_url VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_meeting (
    meeting_id VARCHAR PRIMARY KEY,
    meeting_date DATE NOT NULL,
    meeting_type VARCHAR NOT NULL,
    meeting_title VARCHAR,
    source_url VARCHAR NOT NULL,
    minutes_url VARCHAR,
    agenda_url VARCHAR,
    video_url VARCHAR
);

CREATE TABLE IF NOT EXISTS dim_motion (
    motion_id VARCHAR PRIMARY KEY,
    meeting_id VARCHAR NOT NULL,
    item_number VARCHAR,
    source_motion_text VARCHAR,
    plain_english_summary VARCHAR,
    mover_councillor_id VARCHAR,
    seconder_councillor_id VARCHAR,
    result VARCHAR,
    motion_type VARCHAR,
    operating_capital VARCHAR,
    recurring_one_time VARCHAR,
    financial_impact_status VARCHAR,
    financial_impact_amount DECIMAL(18,2),
    financial_impact_direction VARCHAR,
    financial_impact_notes VARCHAR,
    significance_flag BOOLEAN DEFAULT FALSE,
    significance_reason VARCHAR,
    source_url VARCHAR NOT NULL,
    source_page VARCHAR,
    source_item VARCHAR,
    extraction_confidence VARCHAR,
    review_status VARCHAR DEFAULT 'unreviewed'
);

CREATE TABLE IF NOT EXISTS bridge_motion_topic (
    motion_id VARCHAR NOT NULL,
    topic_id VARCHAR NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    tagging_method VARCHAR,
    review_status VARCHAR DEFAULT 'unreviewed'
);

CREATE TABLE IF NOT EXISTS fact_budget (
    budget_fact_id VARCHAR PRIMARY KEY,
    fiscal_year INTEGER NOT NULL,
    budget_version_id VARCHAR NOT NULL,
    department_id VARCHAR,
    service_id VARCHAR,
    account_id VARCHAR,
    funding_source_id VARCHAR,
    measure_type VARCHAR NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    source_label VARCHAR,
    source_url VARCHAR NOT NULL,
    source_page VARCHAR,
    source_table VARCHAR,
    extraction_method VARCHAR,
    extraction_confidence VARCHAR,
    review_status VARCHAR DEFAULT 'unreviewed'
);

CREATE TABLE IF NOT EXISTS fact_council_vote (
    vote_fact_id VARCHAR PRIMARY KEY,
    motion_id VARCHAR NOT NULL,
    councillor_id VARCHAR NOT NULL,
    vote_value VARCHAR NOT NULL,
    present BOOLEAN,
    source_url VARCHAR NOT NULL,
    source_page VARCHAR,
    extraction_confidence VARCHAR,
    review_status VARCHAR DEFAULT 'unreviewed'
);

CREATE TABLE IF NOT EXISTS fact_outcome_metric (
    outcome_fact_id VARCHAR PRIMARY KEY,
    fiscal_year INTEGER NOT NULL,
    topic_id VARCHAR,
    service_id VARCHAR,
    metric_name VARCHAR NOT NULL,
    metric_value DECIMAL(18,4),
    metric_unit VARCHAR,
    geography VARCHAR DEFAULT 'City of Peterborough',
    source_url VARCHAR NOT NULL,
    source_page VARCHAR,
    notes VARCHAR,
    review_status VARCHAR DEFAULT 'unreviewed'
);

CREATE TABLE IF NOT EXISTS source_registry (
    source_id VARCHAR PRIMARY KEY,
    source_type VARCHAR NOT NULL,
    fiscal_year INTEGER,
    document_name VARCHAR NOT NULL,
    version_hint VARCHAR,
    authority VARCHAR NOT NULL,
    canonical_url VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    notes VARCHAR
);
