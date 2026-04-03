import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Shared cache — loaded once per session, reset on page reload
const cache: Record<string, string> = {};
let loaded = false;
let loadingPromise: Promise<void> | null = null;

const loadAll = async () => {
  if (loaded) return;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    const { data } = await supabase.from("site_content").select("chiave, valore");
    if (data) {
      data.forEach((d: { chiave: string; valore: string }) => {
        cache[d.chiave] = d.valore;
      });
    }
    loaded = true;
  })();
  return loadingPromise;
};

export function useSiteContent(key: string, fallback: string): string {
  const [value, setValue] = useState<string>(cache[key] || fallback);

  useEffect(() => {
    let cancelled = false;
    loadAll().then(() => {
      if (!cancelled) setValue(cache[key] || fallback);
    });
    return () => { cancelled = true; };
  }, [key, fallback]);

  return value;
}

export function useSiteContentBatch(
  keys: { key: string; fallback: string }[]
): Record<string, string> {
  // Stabilizza il riferimento a keys con useRef per evitare loop infiniti
  // senza dover disabilitare il lint
  const keysRef = useRef(keys);
  keysRef.current = keys;

  const initial = () => {
    const r: Record<string, string> = {};
    keys.forEach(({ key, fallback }) => { r[key] = cache[key] || fallback; });
    return r;
  };

  const [values, setValues] = useState<Record<string, string>>(initial);

  useEffect(() => {
    let cancelled = false;
    loadAll().then(() => {
      if (cancelled) return;
      const r: Record<string, string> = {};
      keysRef.current.forEach(({ key, fallback }) => {
        r[key] = cache[key] || fallback;
      });
      setValues(r);
    });
    return () => { cancelled = true; };
  }, []); // dipendenze vuote corrette: keysRef è stabile, cache è modulo-level

  return values;
}
