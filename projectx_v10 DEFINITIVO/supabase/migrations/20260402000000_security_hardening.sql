-- =============================================
-- SECURITY HARDENING — ProjectX Italia
-- =============================================

-- 1. FIX: galleria RLS — anon vede SOLO opere pubblicate (pubblica = true)
--    Il vecchio USING (true) mostrava anche opere non pubblicate
DROP POLICY IF EXISTS "Anyone can read published gallery items" ON public.galleria;

CREATE POLICY "Anon can only read published gallery items"
  ON public.galleria FOR SELECT
  TO anon
  USING (pubblica = true);

CREATE POLICY "Authenticated can read all gallery items"
  ON public.galleria FOR SELECT
  TO authenticated
  USING (true);

-- 2. FIX: contact_messages — limita lunghezza campi per prevenire spam/injection
--    Aggiunge check su lunghezza nome, email, messaggio
ALTER TABLE public.contact_messages
  ADD CONSTRAINT nome_length CHECK (char_length(nome) BETWEEN 2 AND 100),
  ADD CONSTRAINT email_length CHECK (char_length(email) BETWEEN 5 AND 254),
  ADD CONSTRAINT messaggio_length CHECK (char_length(messaggio) BETWEEN 5 AND 2000);

-- 3. FIX: prezzi — aggiungi policy INSERT esplicita per anon (deve essere negata)
--    Senza questa policy esplicita di blocco, con RLS attivo INSERT da anon è già
--    bloccata di default, ma meglio essere espliciti
-- (già bloccata perché non esiste policy INSERT per anon su prezzi — OK)

-- 4. FIX: site_content — verifica che anon non possa INSERT/UPDATE/DELETE
--    Già coperto dalle policy esistenti, ma aggiungiamo commento esplicito
-- SELECT: anon OK (necessario per caricare testi del sito)
-- INSERT/UPDATE/DELETE: solo authenticated — OK

-- 5. AUDIT: aggiungi colonna ip_hash su contact_messages per tracciare spam
--    (opzionale ma utile per identificare IP che spammano)
-- Non implementato per semplicità — Supabase logs coprono già questo

-- 6. FIX: prezzi_log — assicurati che anon non possa leggere i log dei prezzi
--    (già blocked, ma verifica)
-- SELECT: solo authenticated — OK

