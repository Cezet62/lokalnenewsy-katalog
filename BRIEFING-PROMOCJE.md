# BRIEFING DLA CLAUDE CODE - Moduł Promocji

**Data:** 2025-01-14
**Projekt:** lokalnenewsy.pl
**Cel:** Dodać moduł promocji firm do istniejącego portalu lokalnego

---

## 🎯 KONTEKST BIZNESOWY

Portal lokalny dla gminy Osielsko ma katalog firm, ale brakuje "dynamicznej" warstwy — powodu, żeby mieszkańcy wracali regularnie i żeby firmy chciały przejmować wizytówki.

**Rozwiązanie:** Tablica promocji lokalnych firm.

**Logika:**
- Katalog firm = statyczne wizytówki ("tu są firmy")
- Promocje = dynamiczna warstwa ("co te firmy teraz oferują")
- Promocje są haczykiem — firma chce przejąć wizytówkę, żeby móc dodać promocję

---

## 📊 AKTUALNY STAN PROJEKTU

**Stack:**
- Next.js 15 (App Router)
- Supabase (PostgreSQL + Auth + Storage)
- Tailwind CSS
- Vercel hosting

**Istniejące moduły (działające):**
- Katalog firm (`/firmy`) z wizytówkami i "Przejmij wizytówkę"
- Ogłoszenia (`/ogloszenia`) z formularzem i moderacją
- Panel admina (`/admin`) z CRUD i moderacją
- Newsletter, wydarzenia, aktualności

**Istniejące tabele w Supabase:**
- `companies` - firmy
- `categories` - kategorie firm
- `locations` - miejscowości
- `claims` - zgłoszenia przejęcia wizytówki
- `classifieds` - ogłoszenia (z moderacją - może być wzorem)

---

## 🔧 CO TRZEBA ZBUDOWAĆ

### 1. Tabela `promotions` w Supabase

```sql
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,           -- "Pizza dnia -20%"
  description TEXT,                       -- opcjonalny opis (2-3 zdania)
  image_url TEXT,                         -- opcjonalne zdjęcie
  valid_until DATE NOT NULL,              -- data ważności
  status VARCHAR(20) DEFAULT 'pending',   -- pending / approved / rejected / expired
  contact_email VARCHAR(255),             -- email zgłaszającego (do kontaktu)
  contact_phone VARCHAR(20),              -- telefon (opcjonalny)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indeksy
CREATE INDEX idx_promotions_company ON promotions(company_id);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_promotions_valid_until ON promotions(valid_until);

-- RLS policies (wzoruj się na classifieds)
```

### 2. Strona `/promocje` - Lista promocji

**Wymagania:**
- Lista aktywnych promocji (status = 'approved' AND valid_until >= today)
- Każda promocja pokazuje: tytuł, opis, zdjęcie (jeśli jest), nazwa firmy, ważne do
- Kliknięcie → przejście do wizytówki firmy
- Sortowanie: najnowsze pierwsze
- Prosty, czytelny design (wzoruj się na `/ogloszenia`)

### 3. Formularz "Dodaj promocję"

**Dwa miejsca dostępu:**
1. Przycisk na stronie `/promocje` — "Dodaj promocję swojej firmy"
2. Przycisk przy wizytówce firmy (`/firmy/[slug]`) — obok "Przejmij wizytówkę" dodaj "Dodaj promocję"

**Pola formularza:**
- Wybór firmy z listy (dropdown z istniejących firm w katalogu) — WYMAGANE
- Tytuł promocji (max 100 znaków) — WYMAGANE
- Opis (textarea, opcjonalny)
- Zdjęcie (upload do Supabase Storage, opcjonalne)
- Ważne do (date picker) — WYMAGANE
- Email kontaktowy — WYMAGANE
- Telefon (opcjonalny)

**Po wysłaniu:**
- Status = 'pending'
- Komunikat: "Dziękujemy! Twoja promocja zostanie sprawdzona i opublikowana."

### 4. Panel admina - Moderacja promocji

**Dodaj do `/admin`:**
- Nowa sekcja "Promocje" (wzoruj się na moderacji ogłoszeń)
- Lista promocji do moderacji (status = 'pending')
- Akcje: Zatwierdź / Odrzuć / Edytuj / Usuń
- Podgląd szczegółów promocji

### 5. Promocja przy wizytówce firmy

**Na stronie `/firmy/[slug]`:**
- Jeśli firma ma aktywne promocje → pokaż sekcję "Aktualne promocje"
- Prosta lista z tytułem i datą ważności

### 6. Sekcja na stronie głównej (opcjonalnie)

**Na stronie głównej:**
- Widget "Promocje lokalnych firm" (3-4 najnowsze)
- Link "Zobacz wszystkie →" do `/promocje`

---

## ⚠️ WAŻNE UWAGI

1. **Wzoruj się na module ogłoszeń (`classifieds`)** — podobna logika: formularz publiczny → moderacja → publikacja

2. **Bez logowania** — firmy nie muszą mieć konta. Podają email, Cezary moderuje ręcznie.

3. **Automatyczne wygasanie** — promocje po `valid_until` powinny znikać z listy (filtruj w query, nie usuwaj z bazy)

4. **Zdjęcia** — użyj Supabase Storage (bucket 'promotions' lub istniejący)

5. **RLS policies** — ustaw podobnie jak dla `classifieds`:
   - SELECT: wszyscy widzą approved
   - INSERT: wszyscy mogą dodać (status = pending)
   - UPDATE/DELETE: tylko admin

---

## 📁 SUGEROWANA STRUKTURA PLIKÓW

```
app/
├── promocje/
│   ├── page.tsx              # Lista promocji
│   └── dodaj/
│       └── page.tsx          # Formularz dodawania
├── api/
│   └── promotions/
│       └── route.ts          # API endpoint
├── admin/
│   └── promocje/
│       └── page.tsx          # Panel moderacji

components/
├── promotions/
│   ├── PromotionCard.tsx     # Karta pojedynczej promocji
│   ├── PromotionForm.tsx     # Formularz
│   └── PromotionsList.tsx    # Lista promocji

lib/
└── supabase/
    └── promotions.ts         # Funkcje do obsługi promocji
```

---

## ✅ KOLEJNOŚĆ IMPLEMENTACJI

1. **Baza danych** — utwórz tabelę `promotions` z politykami RLS
2. **API** — endpoint do dodawania promocji
3. **Formularz** — `/promocje/dodaj`
4. **Lista** — `/promocje` z aktywnymi promocjami
5. **Admin** — moderacja w panelu
6. **Integracja** — przycisk przy wizytówce firmy
7. **Strona główna** — widget z promocjami (opcjonalnie)

---

## 🧪 TESTOWANIE

Po implementacji przetestuj:
1. Dodanie promocji przez formularz → czy trafia do bazy ze statusem 'pending'?
2. Moderacja w adminie → czy zmiana statusu działa?
3. Lista promocji → czy pokazuje tylko approved i niewyasłe?
4. Wizytówka firmy → czy pokazuje promocje tej firmy?

---

## 💬 JAK ZACZĄĆ

1. Przeczytaj NOTATKI.md w repo — tam jest pełny kontekst projektu
2. Sprawdź jak zaimplementowane są `classifieds` — podobna logika
3. Zacznij od tabeli w Supabase
4. Potem API i formularz
5. Na końcu integracja z resztą

---

**Gotowe do pracy!**
