// src/features/platform/components/PreviewGuideModal.tsx
import { useEffect, useState } from "react";
import { FaTimes, FaDownload } from "react-icons/fa";
import { fetchGuideBlob } from "../../utils/fetch-guide-blob";

type Props = { guideId: string; title: string; open: boolean; onClose: () => void };

export function PreviewGuideModal({ guideId, title, open, onClose }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let toRevoke: string | null = null;

    async function load() {
      if (!open || !guideId) return;
      setLoading(true);
      setErr(null);
      try {
        const blob = await fetchGuideBlob(guideId);
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        toRevoke = url;
      } catch (e: any) {
        setErr(e?.message || "No se pudo cargar el archivo.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { if (toRevoke) URL.revokeObjectURL(toRevoke); setBlobUrl(null); };
  }, [guideId, open]);

  if (!open) return null;

  const handleDownload = async () => {
    try {
      const blob = await fetchGuideBlob(guideId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (title || "guia").replace(/[\\/:*?"<>|]/g, "").trim() || "guia";
      a.download = `${safe}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo descargar el archivo.");
    }
  };

  return (
  <div className="fixed inset-0 z-50 bg-black/50 flex p-4">
    <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-4xl mx-auto my-auto flex flex-col overflow-hidden max-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold truncate">{title || "Vista previa"}</h3>
        <button className="p-2 rounded hover:bg-gray-100" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      </div>

      {/* Contenido: altura fija y scroll interno */}
      <div className="p-3 overflow-y-auto h-56 sm:h-56 md:h-56">
        {loading && <div className="text-center text-gray-500">Cargando…</div>}
        {err && <div className="text-center text-red-600">{err}</div>}
        {!loading && !err && blobUrl && (
          <iframe title="preview" src={blobUrl} className="w-full h-full border rounded" />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t">
        <button type="button" className="px-4 py-2 rounded border" onClick={onClose}>
          Cerrar
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded bg-platform-mintgreen text-white hover:opacity-90 inline-flex items-center gap-2"
          onClick={handleDownload}
        >
          Descargar
        </button>
      </div>
    </div>
  </div>
);


}
