-- =============================================
-- LOKALNENEWSY.PL - TABELA WYDARZENIA
-- Uruchom w Supabase SQL Editor
-- =============================================

-- TABELA: events (wydarzenia)
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  location TEXT NOT NULL,
  address TEXT,
  event_date DATE NOT NULL,
  event_time_start TIME,
  event_time_end TIME,
  organizer TEXT,
  price TEXT DEFAULT 'Wstęp wolny',
  website_url TEXT,
  facebook_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_published ON events(is_published);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_events_date ON events(event_date);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wydarzenia są publiczne" ON events FOR SELECT USING (is_published = true);

-- Trigger dla updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PRZYKŁADOWE WYDARZENIA
-- =============================================

INSERT INTO events (title, slug, excerpt, description, image_url, location, address, event_date, event_time_start, event_time_end, organizer, price, is_featured) VALUES
(
  'Festyn Rodzinny w Osielsku',
  'festyn-rodzinny-osielsko-2025',
  'Coroczny festyn z atrakcjami dla całej rodziny, koncertami i lokalnymi przysmakami.',
  'Gmina Osielsko serdecznie zaprasza na coroczny Festyn Rodzinny!

**Program:**
- 10:00 - Oficjalne otwarcie
- 10:30 - Animacje dla dzieci
- 12:00 - Konkursy z nagrodami
- 14:00 - Występy lokalnych zespołów
- 16:00 - Koncert gwiazdy wieczoru
- 20:00 - Pokaz sztucznych ogni

**Atrakcje:**
- Dmuchańce i karuzele
- Stoiska z rękodziełem
- Strefa food trucków
- Kawiarnia plenerowa
- Loteria fantowa

Wstęp wolny! Zapraszamy całe rodziny!',
  'https://picsum.photos/seed/festyn2/1200/630',
  'Park Centralny w Osielsku',
  'ul. Centralna 5, Osielsko',
  '2025-02-15',
  '10:00',
  '21:00',
  'Urząd Gminy Osielsko',
  'Wstęp wolny',
  true
),
(
  'Jarmark Wielkanocny',
  'jarmark-wielkanocny-2025',
  'Tradycyjny jarmark z rękodziełem, ozdobami świątecznymi i regionalnymi przysmakami.',
  'Zapraszamy na Jarmark Wielkanocny w Niemczu!

Na jarmarku znajdziecie:
- Ręcznie robione ozdoby wielkanocne
- Palmy i stroiki
- Tradycyjne wypieki
- Regionalne wędliny i sery
- Rękodzieło lokalnych twórców

Dla dzieci przygotowaliśmy warsztaty zdobienia pisanek oraz spotkanie z zajączkiem wielkanocnym.

Stoiska czynne przez cały weekend.',
  'https://picsum.photos/seed/jarmark/1200/630',
  'Rynek w Niemczu',
  'ul. Rynek 1, Niemcz',
  '2025-04-12',
  '09:00',
  '17:00',
  'Rada Sołecka Niemcz',
  'Wstęp wolny',
  false
),
(
  'Bieg Niepodległości',
  'bieg-niepodleglosci-2025',
  'Sportowe świętowanie z biegami na 5km i 10km oraz biegiem rodzinnym dla dzieci.',
  'Z okazji Święta Niepodległości zapraszamy na Bieg Niepodległości!

**Dystanse:**
- Bieg główny: 10 km
- Bieg krótki: 5 km
- Bieg rodzinny: 1 km (dla dzieci z rodzicami)

**Zapisy:**
Rejestracja online do 8 listopada. Limit miejsc: 500 osób.

**Pakiet startowy zawiera:**
- Numer startowy z chipem
- Koszulkę techniczną
- Medal na mecie
- Posiłek regeneracyjny

Start i meta przy Szkole Podstawowej w Osielsku.',
  'https://picsum.photos/seed/bieg/1200/630',
  'Szkoła Podstawowa w Osielsku',
  'ul. Szkolna 2, Osielsko',
  '2025-11-11',
  '11:00',
  '14:00',
  'Gminny Ośrodek Sportu',
  '40 zł (dorośli) / 20 zł (dzieci)',
  false
),
(
  'Koncert Kolęd i Pastorałek',
  'koncert-koled-2025',
  'Świąteczny koncert w wykonaniu lokalnych chórów i zespołów muzycznych.',
  'Serdecznie zapraszamy na tradycyjny Koncert Kolęd i Pastorałek!

**Wykonawcy:**
- Chór "Cantabile" z Osielska
- Zespół "Mała Orkiestra"
- Soliści ze Szkoły Muzycznej w Bydgoszczy

W programie najpiękniejsze polskie kolędy i pastorałki w tradycyjnych i nowoczesnych aranżacjach.

Po koncercie zapraszamy na poczęstunek: pierniki, gorąca czekolada i herbata.

Wstęp wolny, liczba miejsc ograniczona.',
  'https://picsum.photos/seed/koledy/1200/630',
  'Kościół pw. św. Jana Chrzciciela',
  'ul. Kościelna 10, Osielsko',
  '2025-01-19',
  '17:00',
  '19:00',
  'Parafia Osielsko',
  'Wstęp wolny',
  true
),
(
  'Warsztaty Garncarskie dla Dzieci',
  'warsztaty-garncarskie-dzieci',
  'Kreatywne zajęcia z gliny dla dzieci w wieku 6-12 lat.',
  'Gminny Ośrodek Kultury zaprasza dzieci na warsztaty garncarskie!

**Co będziemy robić:**
- Poznamy historię garncarstwa
- Nauczymy się podstaw pracy z gliną
- Każdy uczestnik wykona własny kubek lub miseczkę
- Prace zostaną wypalone i będzie można je odebrać po 2 tygodniach

**Informacje praktyczne:**
- Wiek uczestników: 6-12 lat
- Zajęcia trwają 2 godziny
- Wszystkie materiały w cenie
- Prosimy o ubranie, które może się ubrudzić

Zapisy telefoniczne lub mailowe.',
  'https://picsum.photos/seed/warsztaty/1200/630',
  'Gminny Ośrodek Kultury',
  'ul. Centralna 12, Osielsko',
  '2025-02-08',
  '10:00',
  '12:00',
  'GOK Osielsko',
  '35 zł',
  false
);

-- =============================================
-- GOTOWE!
-- =============================================
