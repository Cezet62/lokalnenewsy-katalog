-- =============================================
-- LOKALNENEWSY.PL - DANE TESTOWE (10 FIRM)
-- Uruchom TEN SKRYPT PO supabase-setup.sql
-- =============================================

-- Najpierw pobieramy ID kategorii i lokalizacji
-- (zakładamy że zostały już dodane przez supabase-setup.sql)

-- FIRMY TESTOWE
-- Używamy placeholder zdjęć z picsum.photos

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  website, facebook, instagram, description, image_url,
  is_featured, is_claimed, google_maps_url
)
SELECT
  'Hotel Gazdówka Spa',
  'hotel-gazdowka-spa',
  c.id,
  l.id,
  'ul. Bydgoska 52, 86-031 Żołędowo',
  '+48 52 381 35 35',
  'Całodobowo',
  'https://gazdowka.pl',
  'https://facebook.com/gazdowkaspa',
  'https://instagram.com/gazdowkaspa',
  'Luksusowy hotel z centrum SPA w sercu Żołędowa. Oferujemy komfortowe pokoje, restaurację z kuchnią polską oraz bogaty pakiet zabiegów wellness.',
  'https://picsum.photos/seed/gazdowka/800/600',
  true,
  false,
  'https://maps.google.com/?q=Hotel+Gazdówka+Spa+Żołędowo'
FROM categories c, locations l
WHERE c.slug = 'gastronomia' AND l.slug = 'zoledowo';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  website, description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'Pizzeria DaVinci',
  'pizzeria-davinci',
  c.id,
  l.id,
  'ul. Szosa Gdańska 24, 86-031 Osielsko',
  '+48 52 381 22 33',
  'Pn-Czw 11:00-21:00, Pt-Sb 11:00-23:00, Nd 12:00-21:00',
  'https://pizzeriadavinci.pl',
  'Najlepsza pizza w Osielsku! Autentyczne włoskie receptury, świeże składniki i piec opalany drewnem. Dostawa na terenie gminy.',
  'https://picsum.photos/seed/davinci/800/600',
  true,
  false,
  'https://maps.google.com/?q=Pizzeria+DaVinci+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'gastronomia' AND l.slug = 'osielsko';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'GOSiR Osielsko',
  'gosir-osielsko',
  c.id,
  l.id,
  'ul. Centralna 6, 86-031 Osielsko',
  '+48 52 324 18 90',
  'Pn-Pt 7:00-22:00, Sb-Nd 8:00-20:00',
  'Gminny Ośrodek Sportu i Rekreacji. Basen, siłownia, boiska sportowe, korty tenisowe. Organizujemy zajęcia dla dzieci i dorosłych.',
  'https://picsum.photos/seed/gosir/800/600',
  true,
  false,
  'https://maps.google.com/?q=GOSiR+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'sport-rekreacja' AND l.slug = 'osielsko';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  website, description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'Fithouse Sport Club',
  'fithouse-sport-club',
  c.id,
  l.id,
  'ul. Centralna 8A, 86-031 Osielsko',
  '+48 500 123 456',
  'Pn-Pt 6:00-22:00, Sb 8:00-18:00, Nd 9:00-15:00',
  'https://fithouse.pl',
  'Nowoczesny klub fitness z profesjonalnym sprzętem. Zajęcia grupowe, trening personalny, strefa cardio i siłowa.',
  'https://picsum.photos/seed/fithouse/800/600',
  false,
  false,
  'https://maps.google.com/?q=Fithouse+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'sport-rekreacja' AND l.slug = 'osielsko';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'Gabinet Weterynaryjny Sfinks',
  'gabinet-weterynaryjny-sfinks',
  c.id,
  l.id,
  'ul. Leśna 15, 86-031 Osielsko',
  '+48 52 381 44 55',
  'Pn-Pt 9:00-19:00, Sb 9:00-14:00',
  'Kompleksowa opieka weterynaryjna dla Twojego pupila. Szczepienia, zabiegi chirurgiczne, diagnostyka USG i RTG.',
  'https://picsum.photos/seed/sfinks/800/600',
  false,
  false,
  'https://maps.google.com/?q=Gabinet+Weterynaryjny+Sfinks+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'dla-zwierzat' AND l.slug = 'osielsko';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  website, description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'Żłobek Super Kids',
  'zlobek-super-kids',
  c.id,
  l.id,
  'ul. Kwiatowa 3, 86-032 Niemcz',
  '+48 52 320 11 22',
  'Pn-Pt 6:30-17:00',
  'https://superkids-niemcz.pl',
  'Profesjonalna opieka nad dziećmi w wieku 1-3 lata. Wykwalifikowana kadra, własna kuchnia, duży plac zabaw.',
  'https://picsum.photos/seed/superkids/800/600',
  false,
  false,
  'https://maps.google.com/?q=Żłobek+Super+Kids+Niemcz'
FROM categories c, locations l
WHERE c.slug = 'edukacja-dzieci' AND l.slug = 'niemcz';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'Auto-Serwis Bagniewski',
  'auto-serwis-bagniewski',
  c.id,
  l.id,
  'ul. Przemysłowa 7, 86-031 Osielsko',
  '+48 52 381 99 00',
  'Pn-Pt 8:00-17:00, Sb 8:00-13:00',
  'Profesjonalny serwis samochodowy. Naprawy mechaniczne, diagnostyka komputerowa, wymiana opon, klimatyzacja.',
  'https://picsum.photos/seed/bagniewski/800/600',
  false,
  false,
  'https://maps.google.com/?q=Auto-Serwis+Bagniewski+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'motoryzacja' AND l.slug = 'osielsko';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  website, description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'Galeria Osielsko',
  'galeria-osielsko',
  c.id,
  l.id,
  'ul. Szosa Gdańska 40, 86-031 Osielsko',
  '+48 52 324 50 00',
  'Pn-Sb 9:00-21:00, Nd 10:00-20:00',
  'https://galeria-osielsko.pl',
  'Centrum handlowe z szeroką ofertą sklepów, restauracji i usług. Darmowy parking dla klientów.',
  'https://picsum.photos/seed/galeria/800/600',
  true,
  false,
  'https://maps.google.com/?q=Galeria+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'handel-uslugi' AND l.slug = 'osielsko';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'Restauracja Kanwa',
  'restauracja-kanwa',
  c.id,
  l.id,
  'ul. Szosa Gdańska 40, 86-031 Osielsko (Galeria)',
  '+48 52 324 55 66',
  'Pn-Czw 11:00-21:00, Pt-Sb 11:00-22:00, Nd 12:00-20:00',
  'Elegancka restauracja w Galerii Osielsko. Kuchnia polska i międzynarodowa, lunch menu, imprezy okolicznościowe.',
  'https://picsum.photos/seed/kanwa/800/600',
  false,
  false,
  'https://maps.google.com/?q=Restauracja+Kanwa+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'gastronomia' AND l.slug = 'osielsko';

INSERT INTO companies (
  name, slug, category_id, location_id, address, phone, hours,
  description, image_url, is_featured, is_claimed, google_maps_url
)
SELECT
  'SP im. Polskich Olimpijczyków',
  'sp-polskich-olimpijczykow',
  c.id,
  l.id,
  'ul. Szkolna 2, 86-031 Osielsko',
  '+48 52 324 18 50',
  'Sekretariat: Pn-Pt 7:30-15:30',
  'Szkoła podstawowa z bogatą ofertą zajęć pozalekcyjnych. Nowoczesna baza sportowa, pracownie komputerowe, świetlica.',
  'https://picsum.photos/seed/spolimpijczykow/800/600',
  false,
  false,
  'https://maps.google.com/?q=SP+Polskich+Olimpijczyków+Osielsko'
FROM categories c, locations l
WHERE c.slug = 'edukacja-dzieci' AND l.slug = 'osielsko';

-- =============================================
-- GOTOWE! 10 firm testowych dodanych.
-- =============================================
