-- =============================================
-- LOKALNENEWSY.PL - SETUP BAZY DANYCH
-- Uruchom ten skrypt w Supabase SQL Editor
-- =============================================

-- 1. TABELA: categories (kategorie firm)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA: locations (miejscowości)
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA: companies (firmy)
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  owner_email TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA: claims (zgłoszenia przejęcia wizytówki)
CREATE TABLE claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEKSY (dla wydajności)
-- =============================================

CREATE INDEX idx_companies_category ON companies(category_id);
CREATE INDEX idx_companies_location ON companies(location_id);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_featured ON companies(is_featured);
CREATE INDEX idx_claims_company ON claims(company_id);
CREATE INDEX idx_claims_status ON claims(status);

-- =============================================
-- DANE STARTOWE: Kategorie
-- =============================================

INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Gastronomia', 'gastronomia', '🍽️', 1),
  ('Sport & Rekreacja', 'sport-rekreacja', '🏋️', 2),
  ('Dla zwierząt', 'dla-zwierzat', '🐾', 3),
  ('Edukacja & Dzieci', 'edukacja-dzieci', '👶', 4),
  ('Motoryzacja', 'motoryzacja', '🔧', 5),
  ('Handel & Usługi', 'handel-uslugi', '🛒', 6),
  ('Instytucje', 'instytucje', '🏛️', 7);

-- =============================================
-- DANE STARTOWE: Miejscowości
-- =============================================

INSERT INTO locations (name, slug, sort_order) VALUES
  ('Osielsko', 'osielsko', 1),
  ('Niemcz', 'niemcz', 2),
  ('Żołędowo', 'zoledowo', 3),
  ('Maksymilianowo', 'maksymilianowo', 4),
  ('Jarużyn', 'jaruzyn', 5),
  ('Bożenkowo', 'bozenkowo', 6);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Włącz RLS na tabelach
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Polityki dla odczytu publicznego
CREATE POLICY "Kategorie są publiczne" ON categories FOR SELECT USING (true);
CREATE POLICY "Miejscowości są publiczne" ON locations FOR SELECT USING (true);
CREATE POLICY "Firmy są publiczne" ON companies FOR SELECT USING (true);

-- Polityka dla dodawania claims (każdy może zgłosić)
CREATE POLICY "Każdy może zgłosić claim" ON claims FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNKCJA: Aktualizacja updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- GOTOWE! Teraz możesz dodawać firmy.
-- =============================================
