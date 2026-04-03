
-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- 1. CONTACT MESSAGES TABLE
-- =============================================
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  tipo_richiesta TEXT NOT NULL,
  messaggio TEXT NOT NULL,
  stato TEXT NOT NULL DEFAULT 'nuovo' CHECK (stato IN ('nuovo', 'in_lavorazione', 'completato')),
  letto BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can read all messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- Anonymous users (public form) can only insert
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =============================================
-- 2. PREZZI TABLE
-- =============================================
CREATE TABLE public.prezzi (
  id SERIAL PRIMARY KEY,
  piano TEXT NOT NULL UNIQUE CHECK (piano IN ('mini', 'standard', 'premium')),
  prezzo_base NUMERIC NOT NULL DEFAULT 0,
  dimensione TEXT NOT NULL DEFAULT '',
  descrizione TEXT NOT NULL DEFAULT '',
  badge_consigliato BOOLEAN NOT NULL DEFAULT false,
  visibile BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prezzi ENABLE ROW LEVEL SECURITY;

-- Everyone can read prices (public site needs this)
CREATE POLICY "Anyone can read prezzi"
  ON public.prezzi FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated (admin) can update
CREATE POLICY "Authenticated users can update prezzi"
  ON public.prezzi FOR UPDATE
  TO authenticated
  USING (true);

CREATE TRIGGER update_prezzi_updated_at
  BEFORE UPDATE ON public.prezzi
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 3. GALLERIA TABLE
-- =============================================
CREATE TABLE public.galleria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  titolo TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('Ritratto Personalizzato', 'Edizione Limitata', 'Icona Contemporanea')),
  badge TEXT,
  descrizione TEXT NOT NULL DEFAULT '',
  immagine_url TEXT NOT NULL DEFAULT '',
  ordine INTEGER NOT NULL DEFAULT 0,
  pubblica BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.galleria ENABLE ROW LEVEL SECURITY;

-- Everyone can read published gallery items
CREATE POLICY "Anyone can read published gallery items"
  ON public.galleria FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated can manage
CREATE POLICY "Authenticated users can insert gallery items"
  ON public.galleria FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery items"
  ON public.galleria FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete gallery items"
  ON public.galleria FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- 4. PRICE CHANGE LOG
-- =============================================
CREATE TABLE public.prezzi_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  piano TEXT NOT NULL,
  campo_modificato TEXT NOT NULL,
  valore_precedente TEXT,
  valore_nuovo TEXT
);

ALTER TABLE public.prezzi_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read price logs"
  ON public.prezzi_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert price logs"
  ON public.prezzi_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- 5. STORAGE BUCKET FOR GALLERY IMAGES
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('galleria', 'galleria', true);

CREATE POLICY "Anyone can view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galleria');

CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'galleria');

CREATE POLICY "Authenticated users can update gallery images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'galleria');

CREATE POLICY "Authenticated users can delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'galleria');
