-- =============================================
-- LOKALNENEWSY.PL - TABELA AKTUALNOŚCI
-- Uruchom w Supabase SQL Editor
-- =============================================

-- TABELA: articles (aktualności/newsy)
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'aktualnosci',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  author TEXT DEFAULT 'Redakcja',
  views INT DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_articles_featured ON articles(is_featured);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artykuły są publiczne" ON articles FOR SELECT USING (is_published = true);

-- Trigger dla updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PRZYKŁADOWE ARTYKUŁY
-- =============================================

INSERT INTO articles (title, slug, excerpt, content, image_url, category, is_featured, author, published_at) VALUES
(
  'Festyn rodzinny w Osielsku już w najbliższą sobotę',
  'festyn-rodzinny-osielsko-2025',
  'Zapraszamy wszystkich mieszkańców na coroczny festyn rodzinny. Atrakcje dla dzieci, koncerty i lokalne przysmaki.',
  'Gmina Osielsko zaprasza na coroczny Festyn Rodzinny, który odbędzie się w najbliższą sobotę na terenie parku przy ul. Centralnej.

W programie:
- 10:00 - Oficjalne otwarcie
- 11:00 - Zabawy i konkursy dla dzieci
- 13:00 - Występy lokalnych zespołów
- 15:00 - Koncert główny
- 18:00 - Pokaz sztucznych ogni

Na miejscu będą dostępne stoiska z lokalnymi przysmakami, kawiarnia plenerowa oraz strefa foodtrucków.

Wstęp wolny! Zapraszamy całe rodziny!',
  'https://picsum.photos/seed/festyn/1200/630',
  'wydarzenia',
  true,
  'Redakcja',
  NOW()
),
(
  'Nowy plac zabaw w Niemczu oficjalnie otwarty',
  'nowy-plac-zabaw-niemcz',
  'Dzieci z Niemcza mogą już korzystać z nowoczesnego placu zabaw przy ul. Kwiatowej.',
  'W minioną środę odbyło się uroczyste otwarcie nowego placu zabaw w Niemczu. Inwestycja kosztowała gminę ponad 200 tysięcy złotych.

Plac wyposażony jest w:
- Wielofunkcyjną wieżę ze zjeżdżalniami
- Huśtawki dla dzieci w różnym wieku
- Karuzele i bujaki
- Trampolinę ziemną
- Strefę dla maluchów

"To odpowiedź na prośby mieszkańców. Cieszę się, że mogliśmy zrealizować tę inwestycję" - powiedział wójt gminy podczas otwarcia.

Plac jest dostępny codziennie od 8:00 do zmroku.',
  'https://picsum.photos/seed/placzabaw/1200/630',
  'aktualnosci',
  false,
  'Redakcja',
  NOW() - INTERVAL '1 day'
),
(
  'Uwaga! Zmiana rozkładu jazdy autobusów linii 92',
  'zmiana-rozkladu-autobus-92',
  'Od poniedziałku obowiązuje nowy rozkład jazdy na linii 92 Bydgoszcz - Osielsko.',
  'Informujemy, że od najbliższego poniedziałku wchodzi w życie nowy rozkład jazdy autobusów linii 92.

Główne zmiany:
- Dodatkowy kurs o 6:15 z Osielska
- Przesunięcie kursu z 7:30 na 7:45
- Nowy przystanek przy Galerii Osielsko
- Wydłużenie trasy do Żołędowa w weekendy

Nowy rozkład dostępny jest na stronie ZDMiKP oraz w aplikacji mobilnej.

W razie pytań prosimy o kontakt z Urzędem Gminy.',
  'https://picsum.photos/seed/autobus/1200/630',
  'komunikaty',
  false,
  'Urząd Gminy',
  NOW() - INTERVAL '2 days'
),
(
  'Rekrutacja do przedszkoli na rok 2025/2026 rozpoczęta',
  'rekrutacja-przedszkola-2025',
  'Rodzice mogą już składać wnioski o przyjęcie dzieci do publicznych przedszkoli w gminie.',
  'Urząd Gminy Osielsko informuje o rozpoczęciu rekrutacji do publicznych przedszkoli na rok szkolny 2025/2026.

Terminy:
- 1-15 marca: składanie wniosków
- 20 marca: ogłoszenie wyników
- 25-31 marca: potwierdzenie woli przyjęcia

Wymagane dokumenty:
- Wypełniony wniosek rekrutacyjny
- Oświadczenie o zamieszkaniu na terenie gminy
- Dokumenty potwierdzające kryteria dodatkowe

Wnioski można składać elektronicznie przez system e-Rekrutacja lub osobiście w wybranym przedszkolu.

Szczegółowe informacje na stronie Urzędu Gminy.',
  'https://picsum.photos/seed/przedszkole/1200/630',
  'aktualnosci',
  false,
  'Redakcja',
  NOW() - INTERVAL '3 days'
),
(
  'Dyżury aptek w gminie - styczeń 2025',
  'dyzury-aptek-styczen-2025',
  'Sprawdź, która apteka dyżuruje w nocy i weekendy w styczniu.',
  'Publikujemy harmonogram dyżurów aptek na terenie gminy Osielsko i okolic na styczeń 2025.

**Apteki całodobowe w Bydgoszczy:**
- Apteka Centrum, ul. Dworcowa 42

**Dyżury weekendowe (sob-nd 8:00-20:00):**
- 4-5.01 - Apteka Zdrowie, Osielsko ul. Szosa Gdańska
- 11-12.01 - Apteka Pod Lwem, Niemcz ul. Bydgoska
- 18-19.01 - Apteka Zdrowie, Osielsko ul. Szosa Gdańska
- 25-26.01 - Apteka Pod Lwem, Niemcz ul. Bydgoska

W nagłych przypadkach poza godzinami dyżurów najbliższa apteka całodobowa znajduje się w Bydgoszczy.',
  'https://picsum.photos/seed/apteka/1200/630',
  'informacje',
  false,
  'Redakcja',
  NOW() - INTERVAL '5 days'
);

-- =============================================
-- GOTOWE!
-- =============================================
