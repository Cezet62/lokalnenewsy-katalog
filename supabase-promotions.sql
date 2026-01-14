-- ===========================================
-- TABELA PROMOCJI
-- Uruchom ten skrypt w Supabase SQL Editor
-- ===========================================

-- Tworzenie tabeli promotions
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  valid_until DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla wydajności
CREATE INDEX idx_promotions_company ON promotions(company_id);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_promotions_valid_until ON promotions(valid_until);
CREATE INDEX idx_promotions_created_at ON promotions(created_at DESC);

-- Włącz Row Level Security
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Polityki RLS

-- Wszyscy mogą widzieć zatwierdzone i niewygasłe promocje
CREATE POLICY "Public can view approved promotions"
ON promotions FOR SELECT
USING (status = 'approved' AND valid_until >= CURRENT_DATE);

-- Zalogowani (admin) mogą widzieć wszystkie
CREATE POLICY "Authenticated can view all promotions"
ON promotions FOR SELECT
TO authenticated
USING (true);

-- Wszyscy mogą dodać promocję (status będzie pending)
CREATE POLICY "Anyone can insert promotions"
ON promotions FOR INSERT
WITH CHECK (true);

-- Tylko zalogowani (admin) mogą aktualizować
CREATE POLICY "Authenticated can update promotions"
ON promotions FOR UPDATE
TO authenticated
USING (true);

-- Tylko zalogowani (admin) mogą usuwać
CREATE POLICY "Authenticated can delete promotions"
ON promotions FOR DELETE
TO authenticated
USING (true);

-- Bucket w Storage dla zdjęć promocji (opcjonalnie)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('promotions', 'promotions', true);

-- ===========================================
-- KONIEC
-- ===========================================
