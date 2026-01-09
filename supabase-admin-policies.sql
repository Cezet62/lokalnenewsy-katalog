-- =============================================
-- LOKALNENEWSY.PL - POLITYKI RLS DLA ADMINA
-- Uruchom w Supabase SQL Editor
-- =============================================

-- Polityki dla zalogowanych użytkowników (adminów)

-- ARTICLES: pełny dostęp dla zalogowanych
CREATE POLICY "Admin może zarządzać artykułami" ON articles
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- EVENTS: pełny dostęp dla zalogowanych
CREATE POLICY "Admin może zarządzać wydarzeniami" ON events
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- COMPANIES: pełny dostęp dla zalogowanych
CREATE POLICY "Admin może zarządzać firmami" ON companies
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CATEGORIES: pełny dostęp dla zalogowanych
CREATE POLICY "Admin może zarządzać kategoriami" ON categories
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- LOCATIONS: pełny dostęp dla zalogowanych
CREATE POLICY "Admin może zarządzać lokalizacjami" ON locations
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CLAIMS: pełny dostęp dla zalogowanych
CREATE POLICY "Admin może zarządzać zgłoszeniami" ON claims
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- GOTOWE!
-- =============================================
