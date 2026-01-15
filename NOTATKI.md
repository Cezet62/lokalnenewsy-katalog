# NOTATKI PROJEKTU - lokalnenewsy.pl

## O projekcie

Portal lokalny dla gminy Osielsko (okolice Bydgoszczy) - "lokalna gazetka online" z katalogiem firm.

**Cel główny:** Lead generation dla biznesu WaaS (strony dla firm)

---

## Model biznesowy

### Dwa produkty:
1. **lokalnenewsy.pl** - portal lokalny (ten projekt)
2. **mojastronaonline.pl** - strony dla klientów (WaaS)

### Pricing WaaS:
- ~150 zł/miesiąc za stronę
- Plan: 100-200 stron w portfolio
- Większość stron BEZ CMS
- E-commerce = z CMS
- Marketing: "Strona w 24h"

### Czas na projekt:
- 20-30 godzin tygodniowo na tworzenie contentu
- Launch dopiero gdy 100% zadowolony

---

## Stack technologiczny

- **Frontend:** Next.js 16 (App Router)
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS
- **Email:** Resend (powiadomienia o moderacji)

### Ważne linki:
- **Strona:** https://lokalnenewsy-katalog.vercel.app
- **GitHub:** https://github.com/Cezet62/lokalnenewsy-katalog
- **Supabase:** https://supabase.com/dashboard (projekt: lokalnenewsy)
- **Vercel:** https://vercel.com/dashboard

---

## Zrealizowane moduły

### 1. Strona główna (news-centric)
- Hero z wyróżnionym artykułem
- Widget pogody (Open-Meteo API, Osielsko)
- Siatka najnowszych newsów
- Wyróżnione firmy
- Newsletter signup

### 2. Aktualności (/aktualnosci)
- Lista artykułów z kategoriami
- Strona pojedynczego artykułu
- Kategorie: aktualnosci, wydarzenia, komunikaty, informacje
- Udostępnianie na Facebook

### 3. Wydarzenia (/wydarzenia)
- Kalendarz wydarzeń
- Podział: nadchodzące / minione
- Szczegóły: data, godzina, miejsce, cena, organizator
- Przycisk nawigacji do Google Maps

### 4. Katalog firm (/firmy)
- Lista firm z filtrami (kategoria, miejscowość)
- Strona wizytówki firmy
- Formularz "Przejmij wizytówkę" (claim)
- Badge: Wyróżniona, Zweryfikowana

### 5. Ogłoszenia (/ogloszenia)
- Kategorie: sprzedam, kupię, usługi, praca, oddam, inne
- Formularz dodawania dla mieszkańców
- Moderacja przed publikacją
- Wygasanie po 30 dniach

### 6. Panel admina (/admin)
- Logowanie przez Supabase Auth
- Dashboard ze statystykami
- CRUD: Artykuły, Wydarzenia, Firmy, Ogłoszenia
- Moderacja ogłoszeń (zatwierdź/odrzuć)

### 7. Info praktyczne (/info)
- Numery alarmowe (112, pogotowie, straż, policja, itd.)
- Ważne kontakty (Urząd Gminy, służby, szkoły, apteki)
- Harmonogram wywozu śmieci dla każdej miejscowości
- Rozkłady jazdy autobusów (linie 91, 92, 93)
- Przydatne linki

### 8. Newsletter
- Formularz zapisu na stronie głównej
- API endpoint /api/newsletter
- Tabela subscribers w Supabase
- Obsługa duplikatów i reaktywacji

### 9. Moduł promocji (/promocje) ✨ NOWE
- Firmy mogą dodawać promocje do swoich wizytówek
- Formularz dodawania promocji (tytuł, opis, data ważności, zdjęcie)
- Moderacja przez admina (zatwierdź/odrzuć)
- Strona listy wszystkich aktywnych promocji
- Promocje widoczne na wizytówce firmy
- Badge "X dni do końca" dla promocji kończących się
- Powiadomienia email (Resend) o nowych promocjach do moderacji
- Tabela: `promotions` w Supabase
- SQL: `supabase-promotions.sql`

### 10. Bento Grid na stronie głównej ✨ NOWE
- Dynamiczna siatka kafelków 4×3 z mieszanym contentem
- Typy treści: promocje, aktualności, wydarzenia, ogłoszenia
- Featured slot 2×2 dla głównego artykułu/promocji
- Komponenty: PromotionBox, NewsBox, EventBox, ClassifiedBox
- PlaceholderBox z CTA gdy brak contentu ("Dodaj promocję", "Dodaj ogłoszenie")
- QuickLinks widget z szybkimi linkami do sekcji
- Automatyczne mieszanie treści (shuffleContent)
- Pełne zdjęcia tła z gradient overlay i białym tekstem
- Zaślepki SVG dla elementów bez zdjęć

### 11. Rozbudowany WeatherWidget ✨ NOWE
- Aktualna data (dzień tygodnia, dzień miesiąca)
- Imieniny - pełny kalendarz 366 dni
- Kliknięcie otwiera popup z:
  - Szczegółową pogodą
  - 3-dniową prognozą (temp. max/min)
  - Imieninami
- Open-Meteo API z forecast_days=5

---

## Do zrobienia

### Priorytet wysoki:
- [x] **Info praktyczne** - numery alarmowe, harmonogram śmieci, rozkłady ✅
- [x] **Newsletter backend** - zapisywanie maili ✅

### Priorytet średni:
- [ ] Upload zdjęć do Supabase Storage (zamiast linków)
- [ ] Powiadomienia "Szukam..." dla ogłoszeń (killer feature)
- [ ] SEO - sitemap, meta tagi, structured data

### Priorytet niski / na później:
- [ ] Integracja z Facebook (auto-post)
- [ ] Statystyki odwiedzin
- [ ] Wersja PWA (offline)
- [ ] Multi-tenant dla innych gmin

---

## Baza danych - tabele

| Tabela | Opis |
|--------|------|
| articles | Aktualności/newsy |
| events | Wydarzenia |
| companies | Firmy w katalogu |
| categories | Kategorie firm |
| locations | Miejscowości (Osielsko, Niemcz, Żołędowo...) |
| claims | Zgłoszenia przejęcia wizytówki |
| classifieds | Ogłoszenia mieszkańców |
| subscribers | Subskrybenci newslettera |
| promotions | Promocje firm ✨ NOWE |

**Pliki SQL w repo:**
- `supabase-setup.sql` - tabele firm
- `supabase-test-data.sql` - dane testowe firm
- `supabase-articles.sql` - aktualności
- `supabase-events.sql` - wydarzenia
- `supabase-classifieds.sql` - ogłoszenia
- `supabase-admin-policies.sql` - polityki RLS dla admina
- `supabase-newsletter.sql` - subskrybenci newslettera
- `supabase-promotions.sql` - promocje firm ✨ NOWE

---

## Konto admina

Utworzone w Supabase Auth → Users
- Email: [twój email]
- Hasło: [twoje hasło]

---

## Notatki różne

### Wyróżnienie od Facebook (ogłoszenia):
- SEO - Google indeksuje (FB grupy nie)
- Bez konta FB
- Czysta struktura, tylko ogłoszenia
- Pomysł na killer feature: powiadomienia "Szukam X" → email gdy ktoś doda

### Miejscowości w gminie Osielsko:
- Osielsko
- Niemcz
- Żołędowo
- Jarużyn
- Bożenkowo
- Niwy
- Maksymilianowo

### Współrzędne dla pogody:
- Osielsko: 53.16°N, 17.94°E

---

---

## Struktura komponentów

### Komponenty strony głównej (src/components/home/)
- `BentoGrid.tsx` - kontener siatki
- `PromotionBox.tsx` - kafelek promocji
- `NewsBox.tsx` - kafelek artykułu
- `EventBox.tsx` - kafelek wydarzenia
- `ClassifiedBox.tsx` - kafelek ogłoszenia
- `PlaceholderBox.tsx` - CTA gdy brak contentu
- `QuickLinks.tsx` - szybkie linki

### Utilities (src/lib/utils/)
- `shuffleContent.ts` - logika mieszania treści dla Bento Grid

---

*Ostatnia aktualizacja: 15 stycznia 2025*
