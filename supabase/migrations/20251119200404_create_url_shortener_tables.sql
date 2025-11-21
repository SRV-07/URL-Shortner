/*
  # URL Shortener Database Schema

  1. New Tables
    - `urls`
      - `id` (uuid, primary key) - Unique identifier for each URL
      - `short_code` (text, unique) - The shortened code (e.g., "abc123")
      - `original_url` (text) - The full original URL to redirect to
      - `created_at` (timestamptz) - When the URL was created
      - `clicks` (integer) - Total number of clicks
    
    - `url_clicks`
      - `id` (uuid, primary key) - Unique identifier for each click
      - `url_id` (uuid, foreign key) - References urls table
      - `clicked_at` (timestamptz) - When the click occurred
      - `user_agent` (text) - Browser/device information
      - `referrer` (text) - Where the click came from

  2. Indexes
    - Index on `short_code` for fast lookups
    - Index on `url_id` in url_clicks for analytics queries

  3. Security
    - Enable RLS on both tables
    - Public read access for URL redirects
    - Click tracking is publicly writable (for analytics)
    
  4. Important Notes
    - URLs are publicly accessible (no authentication required)
    - Click tracking is anonymous
    - Short codes are unique and case-sensitive
*/

CREATE TABLE IF NOT EXISTS urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code text UNIQUE NOT NULL,
  original_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  clicks integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS url_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id uuid NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at timestamptz DEFAULT now(),
  user_agent text DEFAULT '',
  referrer text DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_url_clicks_url_id ON url_clicks(url_id);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "URLs are publicly readable"
  ON urls FOR SELECT
  USING (true);

CREATE POLICY "URLs are publicly insertable"
  ON urls FOR INSERT
  WITH CHECK (true);

CREATE POLICY "URLs are publicly updatable"
  ON urls FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "URLs are publicly deletable"
  ON urls FOR DELETE
  USING (true);

CREATE POLICY "URL clicks are publicly readable"
  ON url_clicks FOR SELECT
  USING (true);

CREATE POLICY "URL clicks are publicly insertable"
  ON url_clicks FOR INSERT
  WITH CHECK (true);