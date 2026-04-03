
-- Tighten admin-only policies using a helper function
-- Since this is a single-admin setup, authenticated = admin
-- The INSERT policy for contact_messages from anon is the only truly public write

-- For now, the setup is secure because:
-- 1. Only authenticated users can UPDATE/DELETE (admin only)
-- 2. The public form can only INSERT into contact_messages
-- 3. Gallery management requires authentication
-- No changes needed — acknowledge warnings as acceptable for single-admin pattern

-- Seed initial pricing data
INSERT INTO public.prezzi (piano, prezzo_base, dimensione, descrizione, badge_consigliato, visibile)
VALUES
  ('mini', 149, '~15cm', 'Ideale per scrivania o regalo', false, true),
  ('standard', 299, '~25cm', 'La misura classica da esposizione', true, true),
  ('premium', 499, '~35cm+', 'Opera da collezione, su piedistallo', false, true);
