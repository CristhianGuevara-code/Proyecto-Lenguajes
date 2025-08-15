// src/features/platform/utils/fetch-guide-blob.ts
import { eduRuralApi } from "../../../core/api/edurural.api";

const CACHE_NAME = "guides-downloads";

export async function fetchGuideBlob(guideId: string): Promise<Blob> {
  // Tu axios tiene baseURL '/api', así que usamos ruta relativa:
  const route = `guides/${guideId}/download?mode=preview`;
  // Clave tal como viajaría por red:
  const cacheKey = `/api/${route}`;

  const useCache = async () => {
    if (!("caches" in window)) throw new Error("Cache API no disponible.");
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(cacheKey);
    if (!hit) throw new Error("Archivo no encontrado en caché.");
    return await hit.blob();
  };

  // 1) Si no hay internet, intenta directo desde caché
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return await useCache();
  }

  // 2) Online: intenta red; si falla, cae a caché
  try {
    const { data } = await eduRuralApi.get(route, { responseType: "blob" });
    const pdfBlob = new Blob([data], { type: "application/pdf" });

    // Guarda en caché con Content-Type correcto
    if ("caches" in window) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(
        cacheKey,
        new Response(pdfBlob, { headers: { "Content-Type": "application/pdf" } })
      );
    }

    return pdfBlob;
  } catch (_e) {
    // Fallback a caché si la red falló
    return await useCache();
  }
}
