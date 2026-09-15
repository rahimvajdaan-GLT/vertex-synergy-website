import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { MODEL_FILES } from "@/lib/modelAssets";
import { Upload, Save, Trash2, ArrowLeft, CheckCircle2, AlertCircle, Loader2, FileBox } from "lucide-react";
import { Link } from "react-router-dom";

// Admin-only page to manage the .glb 3D model assets that drive the homepage
// scroll story. Each record maps a `slot` (used by the engine) to a hosted file_url.
export default function AdminModels() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [draft, setDraft] = useState({ slot: "", name: "", description: "", file_url: "" });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const items = await base44.entities.ModelAsset.list();
      setAssets(items || []);
    } catch (e) {
      setError("Could not load models. Make sure you are signed in as an admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const onUpload = async (file, slot) => {
    setBusy(true); setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const name = (assets.find(a => a.slot === slot)?.name) || MODEL_FILES.find(f => f.id === slot)?.id || slot;
      if (assets.find(a => a.slot === slot)) {
        await base44.entities.ModelAsset.update(assets.find(a => a.slot === slot).id, { file_url });
        flash(`Updated "${slot}"`);
      } else {
        await base44.entities.ModelAsset.create({ slot, name, file_url });
        flash(`Uploaded "${slot}"`);
      }
      await load();
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally { setBusy(false); }
  };

  const saveDraft = async () => {
    if (!draft.slot || !draft.file_url) { setError("Slot and file are required"); return; }
    setBusy(true); setError("");
    try {
      await base44.entities.ModelAsset.create({
        slot: draft.slot,
        name: draft.name || draft.slot,
        description: draft.description,
        file_url: draft.file_url,
      });
      setDraft({ slot: "", name: "", description: "", file_url: "" });
      flash("Model added");
      await load();
    } catch (e) { setError(e.message || "Save failed"); }
    finally { setBusy(false); }
  };

  const updateField = async (id, field, value) => {
    try {
      await base44.entities.ModelAsset.update(id, { [field]: value });
      await load();
    } catch (e) { setError(e.message || "Update failed"); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this model record?")) return;
    setBusy(true);
    try {
      await base44.entities.ModelAsset.delete(id);
      flash("Deleted");
      await load();
    } catch (e) { setError(e.message || "Delete failed"); }
    finally { setBusy(false); }
  };

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070a12] text-slate-300 px-6">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-amber-400" size={32} />
          <h1 className="font-heading text-2xl text-white">Admins only</h1>
          <p className="mt-2 text-slate-400">This page is restricted to admin users. Your account doesn't have access.</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 text-amber-400 hover:text-amber-300">
            <ArrowLeft size={16} /> Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 px-6 py-10 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400">
              <ArrowLeft size={14} /> Back to site
            </Link>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">Model Asset Manager</h1>
            <p className="mt-1 text-sm text-slate-400">Upload and manage the <span className="font-mono text-slate-300">.glb</span> files used by the 3D story.</p>
          </div>
          <FileBox className="hidden md:block text-amber-400/70" size={48} />
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> <span>{error}</span>
          </div>
        )}
        {toast && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={16} /> <span>{toast}</span>
          </div>
        )}

        {/* Existing models */}
        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400">Existing Models</h2>
          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin" size={16} /> Loading…</div>
          ) : (
            <div className="mt-4 space-y-3">
              {assets.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-700/50 bg-card/60 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-md bg-amber-500/15 px-2 py-1 font-mono text-xs text-amber-300">{a.slot}</span>
                    <input
                      defaultValue={a.name}
                      onBlur={(e) => { if (e.target.value && e.target.value !== a.name) updateField(a.id, "name", e.target.value); }}
                      className="flex-1 min-w-[160px] rounded-md border border-slate-700/50 bg-[#0a0e17] px-3 py-1.5 text-sm text-slate-200 focus:border-amber-400/60 focus:outline-none"
                      placeholder="Display name"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-md bg-slate-800/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700/60">
                      <Upload size={13} /> Replace .glb
                      <input type="file" accept=".glb,model/gltf-binary" className="hidden" disabled={busy}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f, a.slot); }} />
                    </label>
                    <button onClick={() => remove(a.id)} disabled={busy}
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                  <input
                    defaultValue={a.description || ""}
                    onBlur={(e) => { if (e.target.value !== (a.description || "")) updateField(a.id, "description", e.target.value); }}
                    className="mt-3 w-full rounded-md border border-slate-800/50 bg-[#0a0e17] px-3 py-1.5 text-xs text-slate-400 focus:border-amber-400/60 focus:outline-none"
                    placeholder="Description (optional)"
                  />
                  <div className="mt-2 truncate font-mono text-[10px] text-slate-600">{a.file_url}</div>
                </div>
              ))}
              {assets.length === 0 && <p className="mt-4 text-sm text-slate-500">No models yet. Upload one below.</p>}
            </div>
          )}
        </section>

        {/* Quick upload for known slots — hidden once all slots are filled */}
        {MODEL_FILES.every((f) => assets.some((a) => a.slot === f.id)) ? (
          <div className="mt-12 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={16} /> All 7 model slots are uploaded — the homepage 3D story is live.
          </div>
        ) : (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400">Quick Upload</h2>
          <p className="mt-1 text-xs text-slate-500">Pick a slot the engine already knows, choose a file, done.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {MODEL_FILES.map((f) => {
              const exists = assets.some(a => a.slot === f.id);
              return (
                <label key={f.id} className="group cursor-pointer rounded-xl border border-slate-700/50 bg-card/40 p-3 transition hover:border-amber-400/40 hover:bg-card/70">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-300">{f.id}</span>
                    {exists ? <CheckCircle2 size={14} className="text-emerald-400" /> : <span className="h-2 w-2 rounded-full bg-slate-600" />}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400">
                    <Upload size={12} /> {exists ? "Replace" : "Upload"} .glb
                    <input type="file" accept=".glb,model/gltf-binary" className="hidden" disabled={busy}
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file, f.id); }} />
                  </div>
                </label>
              );
            })}
          </div>
          {busy && <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><Loader2 className="animate-spin" size={14} /> Uploading…</div>}
        </section>
        )}

        {/* Custom slot */}
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400">Add Custom Slot</h2>
          <div className="mt-4 grid gap-3 rounded-xl border border-slate-700/50 bg-card/40 p-4 md:grid-cols-2">
            <input value={draft.slot} onChange={(e) => setDraft({ ...draft, slot: e.target.value })}
              placeholder="slot (e.g. roof-system)" className="rounded-md border border-slate-700/50 bg-[#0a0e17] px-3 py-2 text-sm text-slate-200 focus:border-amber-400/60 focus:outline-none" />
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Display name" className="rounded-md border border-slate-700/50 bg-[#0a0e17] px-3 py-2 text-sm text-slate-200 focus:border-amber-400/60 focus:outline-none" />
            <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Description (optional)" rows={2}
              className="rounded-md border border-slate-700/50 bg-[#0a0e17] px-3 py-2 text-sm text-slate-200 focus:border-amber-400/60 focus:outline-none md:col-span-2" />
            <div className="md:col-span-2 flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-slate-800/60 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/60">
                <Upload size={14} /> Choose .glb
                <input type="file" accept=".glb,model/gltf-binary" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setDraft({ ...draft, file_url: f }); }} />
              </label>
              {draft.file_url && <span className="truncate text-xs text-slate-400">{draft.file_url.name}</span>}
              <button onClick={saveDraft} disabled={busy || !draft.slot || !draft.file_url}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}