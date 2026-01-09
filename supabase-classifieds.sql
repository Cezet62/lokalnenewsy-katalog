-- =============================================
-- LOKALNENEWSY.PL - TABELA OGŁOSZENIA
-- Uruchom w Supabase SQL Editor
-- =============================================

-- TABELA: classifieds (ogłoszenia)
CREATE TABLE classifieds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'inne',
  price DECIMAL(10,2),
  price_type TEXT DEFAULT 'fixed', -- fixed, negotiable, free, per_hour
  location TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, active, sold, expired, rejected
  is_featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy
CREATE INDEX idx_classifieds_category ON classifieds(category);
CREATE INDEX idx_classifieds_status ON classifieds(status);
CREATE INDEX idx_classifieds_created ON classifieds(created_at DESC);
CREATE INDEX idx_classifieds_expires ON classifieds(expires_at);

-- RLS
ALTER TABLE classifieds ENABLE ROW LEVEL SECURITY;

-- Publiczny odczyt tylko aktywnych ogłoszeń
CREATE POLICY "Ogłoszenia aktywne są publiczne" ON classifieds
  FOR SELECT USING (status = 'active');

-- Każdy może dodać ogłoszenie (jako pending)
CREATE POLICY "Każdy może dodać ogłoszenie" ON classifieds
  FOR INSERT WITH CHECK (true);

-- Admin może wszystko
CREATE POLICY "Admin może zarządzać ogłoszeniami" ON classifieds
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Trigger dla updated_at
CREATE TRIGGER update_classifieds_updated_at
  BEFORE UPDATE ON classifieds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PRZYKŁADOWE OGŁOSZENIA
-- =============================================

INSERT INTO classifieds (title, description, category, price, price_type, location, contact_name, contact_phone, contact_email, image_url, status) VALUES
(
  'Rower górski 26 cali - stan bardzo dobry',
  'Sprzedam rower górski marki Kross, rozmiar ramy M (26 cali). Stan bardzo dobry, regularnie serwisowany. Przerzutki Shimano, hamulce tarczowe. Idealny do jazdy po lesie i w mieście.

Powód sprzedaży: kupiliśmy większy dla dziecka.

Możliwość przywiezienia do Bydgoszczy.',
  'sprzedam',
  450.00,
  'negotiable',
  'Osielsko',
  'Marek',
  '600 123 456',
  'marek@example.com',
  'https://picsum.photos/seed/rower/800/600',
  'active'
),
(
  'Korepetycje z matematyki - szkoła podstawowa i liceum',
  'Oferuję korepetycje z matematyki dla uczniów szkół podstawowych i liceum.

Moje kwalifikacje:
- Absolwent matematyki UMK
- 5 lat doświadczenia w nauczaniu
- Przygotowanie do matury

Zajęcia prowadzę u siebie (Niemcz) lub online. Możliwy dojazd do ucznia w obrębie gminy Osielsko (+20 zł).

Pierwsza lekcja próbna gratis!',
  'uslugi',
  80.00,
  'per_hour',
  'Niemcz',
  'Anna Kowalska',
  '512 345 678',
  NULL,
  'https://picsum.photos/seed/korki/800/600',
  'active'
),
(
  'Szukam opiekunki do dziecka - 2-3 dni w tygodniu',
  'Szukam opiekunki do 4-letniego synka na 2-3 popołudnia w tygodniu (poniedziałek, środa, piątek, godz. 14-18).

Wymagania:
- Doświadczenie w opiece nad dziećmi
- Niepalący
- Mile widziane prawo jazdy

Obowiązki: odbiór z przedszkola, zabawa, ewentualnie pomoc przy kolacji.

Stawka do uzgodnienia. Proszę o kontakt telefoniczny lub SMS.',
  'praca',
  35.00,
  'per_hour',
  'Osielsko, ul. Centralna',
  'Katarzyna',
  '601 234 567',
  'kasia.mama@example.com',
  NULL,
  'active'
),
(
  'Oddam za darmo sofę rozkładaną',
  'Oddam za darmo sofę rozkładaną, kolor szary. Wymiary: 200x90 cm, po rozłożeniu 200x140 cm.

Stan używany ale dobry, bez plam i uszkodzeń. Zdejmowany pokrowiec można prać.

Odbiór osobisty z Żołędowa. Mogę pomóc załadować do samochodu.

Proszę dzwonić po 17:00.',
  'oddam',
  0,
  'free',
  'Żołędowo',
  'Piotr',
  '505 678 901',
  NULL,
  'https://picsum.photos/seed/sofa/800/600',
  'active'
),
(
  'Kupię stare meble - szafy, komody, krzesła',
  'Kupię stare meble drewniane:
- Szafy przedwojenne
- Komody dębowe lub sosnowe
- Krzesła gięte (typu Thonet)
- Stoły rozkładane
- Sekretarzyki

Stan może być do renowacji. Płacę gotówką, odbieram własnym transportem z terenu gminy Osielsko i okolic.

Proszę o zdjęcia na WhatsApp lub MMS.',
  'kupie',
  NULL,
  'negotiable',
  'Osielsko i okolice',
  'Antykwariat Pod Lasem',
  '600 111 222',
  'antyki@example.com',
  'https://picsum.photos/seed/antyki/800/600',
  'active'
);

-- =============================================
-- GOTOWE!
-- =============================================
