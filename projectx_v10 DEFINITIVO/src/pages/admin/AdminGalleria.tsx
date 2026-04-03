import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { Plus, GripVertical, Trash2, Edit, Eye, EyeOff, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type GalleriaItem = Database["public"]["Tables"]["galleria"]["Row"];

const categories = [
  "Ritratto Personalizzato",
  "Edizione Limitata",
  "Icona Contemporanea",
];

const inputStyle = {
  background: "rgba(0,0,0,0.4)",
  borderColor: "rgba(255,255,255,0.1)",
};

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/à|á|ä/g, "a")
    .replace(/è|é|ë/g, "e")
    .replace(/ì|í|ï/g, "i")
    .replace(/ò|ó|ö/g, "o")
    .replace(/ù|ú|ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const AdminGalleria = () => {
  const [items, setItems] = useState<GalleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleriaItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    titolo: "",
    categoria: categories[0],
    badge: "",
    descrizione: "",
    pubblica: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("galleria")
      .select("*")
      .order("ordine", { ascending: true });

    if (error) {
      toast.error("Errore caricamento galleria");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({
      titolo: "",
      categoria: categories[0],
      badge: "",
      descrizione: "",
      pubblica: false,
    });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Immagine troppo grande (max 5MB)");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Formato non supportato (JPG, PNG, WEBP)");
      return;
    }

    setImageFile(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("galleria").upload(name, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("galleria").getPublicUrl(name);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.titolo.trim()) {
      toast.error("Inserisci un titolo");
      return;
    }

    if (!form.descrizione.trim()) {
      toast.error("Inserisci una descrizione");
      return;
    }

    setUploading(true);

    try {
      const normalizedTitle = form.titolo.trim();
      const slug = generateSlug(normalizedTitle);

      if (!slug) {
        toast.error("Titolo non valido per generare lo slug");
        setUploading(false);
        return;
      }

      const duplicateTitle = items.some(
        (i) =>
          i.id !== editing?.id &&
          i.titolo.trim().toLowerCase() === normalizedTitle.toLowerCase()
      );

      if (duplicateTitle) {
        toast.error("Esiste già un'opera con questo titolo");
        setUploading(false);
        return;
      }

      const duplicateSlug = items.some((i) => {
        const itemSlug = "slug" in i ? (i as GalleriaItem & { slug?: string | null }).slug : null;
        return (
          i.id !== editing?.id &&
          itemSlug?.trim().toLowerCase() === slug.toLowerCase()
        );
      });

      if (duplicateSlug) {
        toast.error("Esiste già un'opera con uno slug uguale");
        setUploading(false);
        return;
      }

      let immagine_url = editing?.immagine_url || "";

      if (imageFile) {
        immagine_url = await uploadImage(imageFile);
      }

      if (!immagine_url) {
        toast.error("Carica un'immagine");
        setUploading(false);
        return;
      }

      if (editing) {
        const { error } = await supabase
          .from("galleria")
          .update({
            titolo: normalizedTitle,
            slug,
            categoria: form.categoria,
            badge: form.badge.trim() || null,
            descrizione: form.descrizione.trim(),
            pubblica: form.pubblica,
            immagine_url,
          })
          .eq("id", editing.id);

        if (error) throw error;

        toast.success("Opera aggiornata");
      } else {
        const maxOrdine =
          items.length > 0
            ? Math.max(...items.map((i) => i.ordine ?? 0)) + 1
            : 0;

        const { error } = await supabase.from("galleria").insert({
          titolo: normalizedTitle,
          slug,
          categoria: form.categoria,
          badge: form.badge.trim() || null,
          descrizione: form.descrizione.trim(),
          pubblica: form.pubblica,
          immagine_url,
          ordine: maxOrdine,
        });

        if (error) throw error;

        toast.success("Opera aggiunta");
      }

      resetForm();
      await fetchItems();
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (item: GalleriaItem) => {
    if (!confirm(`Eliminare "${item.titolo}"?`)) return;

    const { error } = await supabase
      .from("galleria")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Errore durante l'eliminazione");
      return;
    }

    toast.success("Opera eliminata");
    await fetchItems();
  };

  const togglePubblica = async (item: GalleriaItem) => {
    const { error } = await supabase
      .from("galleria")
      .update({ pubblica: !item.pubblica })
      .eq("id", item.id);

    if (error) {
      toast.error("Errore aggiornamento visibilità");
      return;
    }

    await fetchItems();
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    const a = items[index];
    const b = items[newIndex];

    const ordineA = a.ordine ?? 0;
    const ordineB = b.ordine ?? 0;

    const [res1, res2] = await Promise.all([
      supabase.from("galleria").update({ ordine: ordineB }).eq("id", a.id),
      supabase.from("galleria").update({ ordine: ordineA }).eq("id", b.id),
    ]);

    if (res1.error || res2.error) {
      toast.error("Errore durante il riordino");
      return;
    }

    await fetchItems();
  };

  const startEdit = (item: GalleriaItem) => {
    setEditing(item);
    setForm({
      titolo: item.titolo,
      categoria: item.categoria,
      badge: item.badge || "",
      descrizione: item.descrizione,
      pubblica: item.pubblica,
    });
    setImageFile(null);
    setShowForm(true);
  };

  return (
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Galleria
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {items.length} opere
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 font-body"
            style={{ color: "#000" }}
          >
            <Plus className="w-4 h-4" />
            Aggiungi Opera
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={resetForm}
            />

            <div
              className="relative glass-panel rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                {editing ? "Modifica Opera" : "Nuova Opera"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground font-body mb-1">
                    Titolo
                  </label>
                  <input
                    type="text"
                    value={form.titolo}
                    onChange={(e) =>
                      setForm({ ...form, titolo: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-foreground font-body text-sm outline-none focus:ring-1 focus:ring-gold-2"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground font-body mb-1">
                    Categoria
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) =>
                      setForm({ ...form, categoria: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border text-foreground font-body text-sm outline-none"
                    style={inputStyle}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground font-body mb-1">
                    Badge (opzionale)
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) =>
                      setForm({ ...form, badge: e.target.value })
                    }
                    placeholder="es. SOLD OUT, PRONTA CONSEGNA"
                    className="w-full px-3 py-2 rounded-lg border text-foreground font-body text-sm outline-none focus:ring-1 focus:ring-gold-2"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground font-body mb-1">
                    Descrizione
                  </label>
                  <textarea
                    value={form.descrizione}
                    onChange={(e) =>
                      setForm({ ...form, descrizione: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border text-foreground font-body text-sm outline-none resize-none focus:ring-1 focus:ring-gold-2"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground font-body mb-1">
                    Immagine{" "}
                    {editing
                      ? "(lascia vuoto per mantenere)"
                      : "(JPG/PNG/WEBP, max 5MB)"}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="w-full text-sm text-muted-foreground font-body file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gold/20 file:text-gold hover:file:bg-gold/30"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground font-body">
                    Pubblica
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, pubblica: !form.pubblica })
                    }
                    className={`w-10 h-5 rounded-full transition-colors ${
                      form.pubblica ? "bg-gold" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-foreground transition-transform ${
                        form.pubblica ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 rounded-full font-semibold text-sm gold-gradient gold-glow transition-all duration-200 font-body disabled:opacity-50"
                  style={{ color: "#000" }}
                >
                  {uploading
                    ? "Caricamento..."
                    : editing
                    ? "Salva Modifiche"
                    : "Aggiungi Opera"}
                </button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground font-body">Caricamento...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body mb-4">
              Nessuna opera in galleria
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-2xl border transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs"
                  >
                    ▲
                  </button>

                  <GripVertical className="w-4 h-4 text-muted-foreground" />

                  <button
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs"
                  >
                    ▼
                  </button>
                </div>

                {item.immagine_url && (
                  <img
                    src={item.immagine_url}
                    alt={item.titolo}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-semibold text-foreground truncate">
                      {item.titolo}
                    </h3>

                    {item.badge && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-body font-semibold gold-gradient"
                        style={{ color: "#000" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground font-body">
                    {item.categoria}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePubblica(item)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.pubblica ? "text-gold" : "text-muted-foreground"
                    }`}
                    title={item.pubblica ? "Pubblicata" : "Bozza"}
                  >
                    {item.pubblica ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    title="Modifica"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteItem(item)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
  );
};

export default AdminGalleria;