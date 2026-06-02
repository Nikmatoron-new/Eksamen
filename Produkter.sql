CREATE TABLE IF NOT EXISTS produkter (
  id SERIAL PRIMARY KEY,
  navn TEXT NOT NULL,
  beskrivelse TEXT,
  pris NUMERIC NOT NULL,
  bilde TEXT
);