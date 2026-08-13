CREATE TABLE IF NOT EXISTS location_search_cache (
    id SERIAL PRIMARY KEY,
    query_text VARCHAR(150) NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_location_cache_query
    ON location_search_cache (LOWER(query_text));

CREATE INDEX IF NOT EXISTS idx_location_cache_query_trgm
    ON location_search_cache USING GIN (query_text gin_trgm_ops);