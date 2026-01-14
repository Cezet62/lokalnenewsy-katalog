# BRIEFING DLA CLAUDE CODE - Moduł Promocji + Nowa Strona Główna

**Data:** 2025-01-14
**Projekt:** lokalnenewsy.pl
**Cel:** Dodać moduł promocji firm + przebudować stronę główną na dynamiczny bento grid

---

## 🎯 KONTEKST BIZNESOWY

Portal lokalny dla gminy Osielsko ma katalog firm i newsy, ale brakuje "dynamicznej" warstwy — powodu, żeby mieszkańcy wracali regularnie i żeby firmy chciały się angażować.

**Rozwiązanie:** 
1. Tablica promocji lokalnych firm
2. Nowa strona główna w stylu "bento grid" — dynamiczna, rotująca content

**Logika biznesowa:**
- Promocje są haczykiem — firma chce przejąć wizytówkę, żeby móc dodać promocję
- Po zatwierdzeniu promocji firma automatycznie staje się "claimed"
- Strona główna pokazuje że "tu się coś dzieje" — różne treści w różnych konfiguracjach

---

## 📊 AKTUALNY STAN PROJEKTU

**Stack:**
- Next.js 15 (App Router)
- Supabase (PostgreSQL + Auth + Storage)
- Tailwind CSS
- Vercel hosting
- Resend (do emaili)

**Istniejące moduły:**
- Katalog firm (`/firmy`) z wizytówkami i "Przejmij wizytówkę"
- Ogłoszenia (`/ogloszenia`) z formularzem i moderacją
- Panel admina (`/admin`) z CRUD i moderacją
- Newsletter, wydarzenia, aktualności
- Widget pogody (Open-Meteo API)

**Istniejące tabele w Supabase:**
- `companies` - firmy (ma pole `is_claimed`)
- `categories` - kategorie firm
- `locations` - miejscowości
- `claims` - zgłoszenia przejęcia wizytówki
- `classifieds` - ogłoszenia (wzór dla promocji)
- `articles` - aktualności
- `events` - wydarzenia

---

# CZĘŚĆ 1: MODUŁ PROMOCJI

## 🔧 1.1 Tabela `promotions` w Supabase

```sql
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  valid_until DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- pending / approved / rejected / expired
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indeksy
CREATE INDEX idx_promotions_company ON promotions(company_id);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_promotions_valid_until ON promotions(valid_until);

-- RLS policies (wzoruj się na classifieds)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Wszyscy widzą zatwierdzone
CREATE POLICY "Promotions are viewable by everyone" 
ON promotions FOR SELECT 
USING (status = 'approved' AND valid_until >= CURRENT_DATE);

-- Wszyscy mogą dodać (status będzie pending)
CREATE POLICY "Anyone can insert promotions" 
ON promotions FOR INSERT 
WITH CHECK (true);

-- Tylko admin może aktualizować/usuwać
CREATE POLICY "Only admins can update promotions" 
ON promotions FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete promotions" 
ON promotions FOR DELETE 
USING (auth.role() = 'authenticated');
```

## 🔧 1.2 Strona `/promocje` - Lista promocji

**Wymagania:**
- Lista aktywnych promocji (status = 'approved' AND valid_until >= today)
- Każda promocja pokazuje: tytuł, opis, zdjęcie (jeśli jest), nazwa firmy, ważne do
- Kliknięcie → przejście do wizytówki firmy
- Sortowanie: najnowsze pierwsze
- Przycisk "Dodaj promocję swojej firmy" → `/promocje/dodaj`
- Design spójny z resztą strony

## 🔧 1.3 Formularz "Dodaj promocję" (`/promocje/dodaj`)

**Pola formularza:**

| Pole | Typ | Wymagane | Uwagi |
|------|-----|----------|-------|
| Firma | Autocomplete | ✅ | Wyszukiwanie po nazwie z tabeli companies |
| Tytuł promocji | Text (max 100) | ✅ | np. "Pizza dnia -20%" |
| Opis | Textarea | ❌ | 2-3 zdania |
| Zdjęcie | File upload | ❌ | Do Supabase Storage |
| Ważne do | Date picker | ✅ | Data końca promocji |
| Email kontaktowy | Email | ✅ | Do weryfikacji |
| Telefon | Tel | ❌ | Opcjonalny |

**Autocomplete dla firmy:**
- Pole tekstowe z wyszukiwaniem
- Wpisujesz "Piz..." → pokazuje "Pizzeria Roma", "Pizza Hut"...
- Wybierasz z listy → zapisuje company_id

**Po wysłaniu:**
- Status = 'pending'
- Komunikat: "Dziękujemy! Twoja promocja zostanie sprawdzona i opublikowana w ciągu 24h."
- Email do admina (Resend): "Nowa promocja do moderacji: [tytuł] dla [firma]"

## 🔧 1.4 Panel admina - Moderacja promocji

**Dodaj do `/admin` nową sekcję "Promocje":**

- Lista promocji do moderacji (status = 'pending')
- Dla każdej: tytuł, firma, data dodania, email zgłaszającego
- Akcje: 
  - ✅ **Zatwierdź** → status = 'approved' + **automatycznie ustaw is_claimed = true dla firmy**
  - ❌ **Odrzuć** → status = 'rejected'
  - ✏️ **Edytuj** → możliwość poprawienia przed zatwierdzeniem
  - 🗑️ **Usuń**
- Podgląd szczegółów promocji (zdjęcie, pełny opis)
- Zakładki: "Do moderacji" / "Aktywne" / "Wygasłe" / "Odrzucone"

**WAŻNE:** Po zatwierdzeniu promocji, firma automatycznie staje się "claimed" (is_claimed = true w tabeli companies). To zachęca firmy do dodawania promocji.

## 🔧 1.5 Promocja przy wizytówce firmy

**Na stronie wizytówki firmy:**
- Jeśli firma ma aktywne promocje → sekcja "Aktualne promocje" z listą
- Przycisk "Dodaj promocję" (obok "Przejmij wizytówkę")
- Kliknięcie → `/promocje/dodaj?firma=[slug]` (prefillowany formularz)

**UWAGA:** W kodzie są dwie ścieżki (`/firma/[slug]` i `/firmy/[slug]`). Ustal która jest główna, na tej dodaj funkcjonalność. Drugą przekieruj lub usuń.

## 🔧 1.6 Email powiadomienie (Resend)

Przy nowej promocji wyślij email do admina:
- Temat: "Nowa promocja do moderacji: [tytuł]"
- Treść: firma, tytuł, opis, email zgłaszającego, link do panelu admina

---

# CZĘŚĆ 2: NOWA STRONA GŁÓWNA (BENTO GRID)

## 🎨 2.1 Koncepcja

Zamiast statycznego layoutu — dynamiczny "bento grid" z mixem treści:
- Różne rozmiary boxów (1x1, 1x2, 2x1, 2x2)
- Mix typów contentu: promocje, aktualności, wydarzenia, ogłoszenia
- **Losowy układ przy każdym odświeżeniu strony**
- Poczucie że "tu się coś dzieje"

## 🎨 2.2 Proporcje contentu

| Typ | Udział | Źródło |
|-----|--------|--------|
| Promocje firm | 50% | tabela `promotions` (approved, niewyasłe) |
| Aktualności/wydarzenia | 20% | tabele `articles`, `events` |
| Ogłoszenia mieszkańców | 20% | tabela `classifieds` (approved) |
| Stałe elementy | 10% | Pogoda, szybkie linki |

## 🎨 2.3 Layout DESKTOP (>1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Osielsko | lokalnenewsy.pl         [nawigacja]             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │                           │  │             │  │    POGODA     │  │
│  │     GŁÓWNY ARTYKUŁ        │  │  PROMOCJA   │  │    widget     │  │
│  │     (2x2)                 │  │  firmy      │  │    (1x1)      │  │
│  │                           │  │  (1x2)      │  ├───────────────┤  │
│  │                           │  │             │  │ SZYBKIE LINKI │  │
│  │                           │  ├─────────────┤  │    (1x1)      │  │
│  │                           │  │  WYDARZENIE │  │               │  │
│  └───────────────────────────┘  └─────────────┘  └───────────────┘  │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐  │
│  │  PROMOCJA   │  │ AKTUALNOŚĆ  │  │                             │  │
│  │  firmy      │  │             │  │     PROMOCJA WYRÓŻNIONA     │  │
│  │  (1x1)      │  │  (1x1)      │  │     (2x2)                   │  │
│  ├─────────────┤  ├─────────────┤  │                             │  │
│  │  OGŁOSZENIE │  │  PROMOCJA   │  │                             │  │
│  │  (1x1)      │  │  firmy      │  │                             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │                             │  │  PROMOCJA   │  │ AKTUALNOŚĆ  │  │
│  │     WYDARZENIE              │  │  firmy      │  │             │  │
│  │     (2x1)                   │  │  (1x1)      │  │  (1x1)      │  │
│  └─────────────────────────────┘  └─────────────┘  └─────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 2.4 Layout MOBILE (<768px) — Mini-bento 2 kolumny

```
┌─────────────────────┐
│      HEADER         │
├─────────────────────┤
│                     │
│   GŁÓWNY ARTYKUŁ    │  ← pełna szerokość (2x1)
│   (duży)            │
│                     │
├──────────┬──────────┤
│ PROMOCJA │  POGODA  │  ← dwa małe obok siebie
│          │          │
├──────────┴──────────┤
│                     │
│  PROMOCJA WYRÓŻN.   │  ← pełna szerokość (2x1)
│                     │
├──────────┬──────────┤
│  NEWS    │ PROMOCJA │  ← dwa małe
│          │          │
├──────────┼──────────┤
│ WYDARZEN.│ OGŁOSZEN.│  ← dwa małe
│          │          │
├──────────┴──────────┤
│                     │
│     PROMOCJA        │  ← pełna szerokość
│                     │
└─────────────────────┘
```

**Rytm mobile:** duży → małe → duży → małe (nie jest monotonne)

## 🎨 2.5 Rozmiary boxów i przyszła monetyzacja

| Rozmiar | Użycie teraz | W przyszłości (płatne) |
|---------|--------------|------------------------|
| 2x2 | Główny artykuł, wyróżniona promocja | Promocja PREMIUM |
| 2x1 | Ważne wydarzenia | Promocja STANDARD |
| 1x2 | Promocje z większym opisem | — |
| 1x1 | Zwykłe promocje, newsy, ogłoszenia | Promocja BASIC |

To daje ścieżkę monetyzacji: większy box = lepsza widoczność = można brać więcej.

## 🎨 2.6 Logika rotacji

**Przy każdym odświeżeniu strony:**
1. Pobierz aktywne promocje (status = approved, valid_until >= today)
2. Pobierz ostatnie aktualności (np. 5)
3. Pobierz nadchodzące wydarzenia (np. 3)
4. Pobierz ostatnie ogłoszenia (np. 5)
5. **Wymieszaj losowo** zachowując proporcje (50% promocje, 20% news, 20% ogłoszenia, 10% stałe)
6. **Przypisz losowo rozmiary** (ale główny artykuł zawsze 2x2, pogoda zawsze 1x1)
7. Renderuj grid

**Stałe elementy (nie rotują):**
- Pogoda (zawsze prawy górny róg, 1x1)
- Szybkie linki (pod pogodą, 1x1)
- Główny/najnowszy artykuł (zawsze duży, 2x2) — lub też rotuje?

**Decyzja:** Główny artykuł niech będzie zawsze najnowszy z kategorii "aktualności" lub "wydarzenia". Reszta rotuje.

## 🎨 2.7 Wypełniacze (gdy mało contentu)

Na starcie będzie mało promocji. Gdy brakuje contentu, pokaż boxy-wypełniacze:

```
┌─────────────────────┐
│                     │
│  🏷️ Tu może być    │
│  Twoja promocja!    │
│                     │
│  [Dodaj za darmo]   │
│                     │
└─────────────────────┘
```

**Warianty wypełniaczy:**
- "Masz firmę w Osielsku? Dodaj promocję za darmo!"
- "Chcesz sprzedać coś lokalnie? Dodaj ogłoszenie"
- "Organizujesz wydarzenie? Daj znać mieszkańcom"

Wypełniacze linkują do odpowiednich formularzy.

## 🎨 2.8 Stylowanie boxów według typu

| Typ | Styl wizualny |
|-----|---------------|
| Promocja | Kolorowa ramka (np. zielona/pomarańczowa), badge "PROMOCJA", cena/rabat wyróżniony |
| Aktualność | Zdjęcie + tytuł, badge z kategorią (jak teraz) |
| Wydarzenie | Data mocno wyróżniona, ikona kalendarza |
| Ogłoszenie | Prostszy styl, badge "OGŁOSZENIE", cena jeśli jest |
| Wypełniacz | Szare tło, CTA button |
| Pogoda | Jak teraz (niebieski gradient) |

---

# CZĘŚĆ 3: STRUKTURA PLIKÓW

```
app/
├── page.tsx                      # PRZEBUDOWAĆ na bento grid
├── promocje/
│   ├── page.tsx                  # Lista promocji
│   └── dodaj/
│       └── page.tsx              # Formularz dodawania
├── api/
│   └── promotions/
│       └── route.ts              # API endpoint
├── admin/
│   └── promocje/
│       └── page.tsx              # Panel moderacji

components/
├── home/
│   ├── BentoGrid.tsx             # Główny komponent grida
│   ├── BentoItem.tsx             # Pojedynczy box (uniwersalny)
│   ├── PromotionBox.tsx          # Box promocji
│   ├── NewsBox.tsx               # Box aktualności
│   ├── EventBox.tsx              # Box wydarzenia
│   ├── ClassifiedBox.tsx         # Box ogłoszenia
│   ├── PlaceholderBox.tsx        # Wypełniacz
│   ├── WeatherWidget.tsx         # Pogoda (przenieś istniejący)
│   └── QuickLinks.tsx            # Szybkie linki
├── promotions/
│   ├── PromotionCard.tsx         # Karta na stronie /promocje
│   ├── PromotionForm.tsx         # Formularz
│   ├── CompanyAutocomplete.tsx   # Autocomplete wyboru firmy
│   └── PromotionsList.tsx        # Lista promocji

lib/
├── supabase/
│   └── promotions.ts             # Funkcje CRUD dla promocji
└── utils/
    └── shuffleContent.ts         # Logika mieszania contentu dla grida
```

---

# CZĘŚĆ 4: KOLEJNOŚĆ IMPLEMENTACJI

## Faza 1: Moduł promocji (backend + podstawy)
1. ✅ Utwórz tabelę `promotions` w Supabase z RLS
2. ✅ API endpoint `/api/promotions`
3. ✅ Formularz dodawania `/promocje/dodaj` z autocomplete
4. ✅ Lista promocji `/promocje`
5. ✅ Moderacja w panelu admina
6. ✅ Email powiadomienie (Resend)
7. ✅ Auto-claim firmy po zatwierdzeniu promocji

## Faza 2: Integracja z wizytówką
8. ✅ Przycisk "Dodaj promocję" przy wizytówce firmy
9. ✅ Sekcja "Aktualne promocje" na stronie firmy
10. ✅ Wyczyść duplikację `/firma` vs `/firmy`

## Faza 3: Nowa strona główna
11. ✅ Komponent BentoGrid
12. ✅ Komponenty poszczególnych boxów (promocja, news, event, ogłoszenie)
13. ✅ Logika mieszania i losowania contentu
14. ✅ Wypełniacze gdy mało contentu
15. ✅ Responsywność (desktop → mobile mini-bento)

## Faza 4: Polish
16. ✅ Testy na różnych rozdzielczościach
17. ✅ Optymalizacja (lazy loading obrazków)
18. ✅ SEO meta tagi dla nowych stron

---

# CZĘŚĆ 5: DECYZJE PODJĘTE

| Temat | Decyzja |
|-------|---------|
| Wybór firmy w formularzu | Autocomplete (nie dropdown) |
| Kto może dodać promocję | Każdy, admin weryfikuje |
| Auto-claim po zatwierdzeniu | Tak — firma staje się "claimed" automatycznie |
| Email dla admina | Tak, przez Resend |
| Rotacja na stronie głównej | Losowy układ przy każdym odświeżeniu |
| Mobile layout | Mini-bento 2 kolumny z rytmem duży-małe-duży |
| Gdy mało contentu | Wypełniacze z CTA |
| Proporcje contentu | 50% promocje, 20% news, 20% ogłoszenia, 10% stałe |

---

# CZĘŚĆ 6: TESTOWANIE

## Moduł promocji:
- [ ] Dodanie promocji → trafia do bazy ze statusem 'pending'
- [ ] Autocomplete firm działa poprawnie
- [ ] Email do admina przychodzi
- [ ] Moderacja w adminie → zmiana statusu działa
- [ ] Po zatwierdzeniu → firma ma is_claimed = true
- [ ] Lista `/promocje` → pokazuje tylko approved i niewygasłe
- [ ] Wizytówka firmy → pokazuje jej promocje

## Strona główna:
- [ ] Bento grid renderuje się poprawnie
- [ ] Każde odświeżenie → inna konfiguracja
- [ ] Proporcje contentu mniej więcej zachowane
- [ ] Mobile → 2 kolumny, rytm duży-małe działa
- [ ] Wypełniacze pokazują się gdy mało contentu
- [ ] Kliknięcie w box → prowadzi do właściwej strony

---

## 💬 JAK ZACZĄĆ

1. Przeczytaj NOTATKI.md w repo — tam jest kontekst całego projektu
2. Sprawdź jak zaimplementowane są `classifieds` — podobna logika dla promocji
3. **Zacznij od Fazy 1** — moduł promocji musi działać zanim przebudujesz stronę główną
4. Po Fazie 1 pokaż Cezaremu działające `/promocje` i moderację
5. Potem Faza 2 i 3

---

**Gotowe do pracy!**
