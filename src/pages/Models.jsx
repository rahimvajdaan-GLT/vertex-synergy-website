import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { SLOTS } from "@/lib/modelAssets";
import SiteNav from "@/components/site/SiteNav";

export default function Models() {
  const [assets, setAssets] = useState({});
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.entities.ModelAsset
      .list()
      .then((items) => {
        const m = {};
        (items || []).forEach((i) => { m[i.slot] = i; });
        setAssets(m);
      })
      .catch(() => {});
  }, []);

  const upload = async (slot, file) => {
    if (!file) return;
    setBusy(slot.id);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const existing = assets[slot.id];
      let rec;
      if (existing) {
        rec = await base44.entities.ModelAsset.update(existing.id, { file_url });
      } else {
        rec = await base44.entities.ModelAsset.create({ slot: slot.id, name: slot.name, file_url, description: slot.body });
      }
      setAssets((a) => ({ ...a, [slot.id]: { ...rec } }));
    } catch (e) {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,#f5f7f9,#e6eaef)] font-body text-slate-900">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.3em] text-orange-500">Admin</p>
            <h1 className="mt-2 font-body text-3xl font-bold tracking-tight md:text-4xl">3D Model Assets</h1>
            <p className="mt-2 max-w-lg font-body text-sm text-slate-600">
              Upload a detailed GLB/GLTF for each slot to make the corresponding scroll stage real. Missing slots show an "asset required" placeholder instead of placeholder geometry.
            </p>
          </div>
          <Link to="/" className="hidden rounded-full border border-slate-300 px-5 py-2.5 font-body text-sm font-semibold text-slate-700 hover:border-slate-400 sm:inline-flex">
            ← Back to site
          </Link>
        </div>

        {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">{error}</p>}

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SLOTS.map((s, i) => {
            const rec = assets[s.id];
            const uploaded = !!rec?.file_url;
            return (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-body text-[11px] uppercase tracking-widest text-orange-500">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-1 font-body text-lg font-bold tracking-tight">{s.name}</h3>
                    <p className="mt-1 font-mono text-xs text-slate-500">{s.path}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 font-body text-[11px] font-semibold ${uploaded ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                    {uploaded ? "Uploaded" : "Missing"}
                  </span>
                </div>
                <p className="mt-3 font-body text-sm leading-relaxed text-slate-600">{s.body}</p>
                <label className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 ${busy === s.id ? "opacity-60" : ""}`}>
                  {busy === s.id ? "Uploading…" : uploaded ? "Replace file" : "Upload GLB/GLTF"}
                  <input type="file" accept=".glb,.gltf" className="hidden" onChange={(e) => upload(s, e.target.files?.[0])} disabled={busy === s.id} />
                </label>
                {uploaded && (
                  <p className="mt-3 truncate font-mono text-[11px] text-slate-400">{rec.file_url}</p>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}