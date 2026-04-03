
-- Create site_content table for editable site texts
CREATE TABLE public.site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chiave TEXT UNIQUE NOT NULL,
  valore TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read all content
CREATE POLICY "Public read content" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);

-- Only authenticated can modify
CREATE POLICY "Authenticated users can update content" ON public.site_content
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete content" ON public.site_content
  FOR DELETE TO authenticated USING (true);

-- Seed default content
INSERT INTO public.site_content (chiave, valore) VALUES
  ('hero_eyebrow', 'Arte · Storia · Tecnologia'),
  ('hero_titolo', 'Il Passato Non Scompare. Si Trasforma.'),
  ('hero_sottotitolo', 'Busti artistici in resina effetto marmo — creati con stampa 3D 8K e rifiniti a mano. Pezzi unici. Made in Italy.'),
  ('manifesto_testo', 'Da duemila anni, il marmo custodisce i volti di chi ha cambiato il mondo. Oggi, la tecnologia ci permette di fare lo stesso. Ogni busto che creo è un atto di memoria. Un oggetto che sfida il tempo.'),
  ('valori_titolo_1', 'Estetica Classica'),
  ('valori_desc_1', 'Ispirazione greco-romana autentica'),
  ('valori_titolo_2', 'Stampa 8K'),
  ('valori_desc_2', 'Risoluzione massima, dettagli al micron'),
  ('valori_titolo_3', 'Rifinito a Mano'),
  ('valori_desc_3', 'Ogni pezzo lavorato personalmente'),
  ('valori_titolo_4', 'Made in Italy'),
  ('valori_desc_4', 'Artigianato digitale italiano'),
  ('contatori_valore_1', '50'),
  ('contatori_suffisso_1', '+'),
  ('contatori_label_1', 'Opere create'),
  ('contatori_valore_2', '8'),
  ('contatori_suffisso_2', 'K'),
  ('contatori_label_2', 'Risoluzione stampa'),
  ('contatori_valore_3', '100'),
  ('contatori_suffisso_3', '%'),
  ('contatori_label_3', 'Soddisfazione'),
  ('contatti_titolo', 'CONTATTI'),
  ('contatti_sottotitolo', 'Ogni busto inizia con una storia. Raccontami la tua.'),
  ('chi_siamo_intro', 'ProjectX Italia nasce dalla passione di Ignis per la scultura classica e dalla sua competenza nella stampa 3D ad alta definizione.'),
  ('chi_siamo_citazione', 'Non creo oggetti. Creo ricordi che sopravvivono al tempo.');
