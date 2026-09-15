import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Send, CheckCircle2, FileText, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const projectTypes = ["Commercial", "Residential", "Hospitality", "Infrastructure", "Industrial", "Healthcare", "Government", "Temporary Facilities", "Retail", "Museum", "Automotive"];

export default function ContactScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);
  const [form, setForm] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("file_url", file_url);
    } catch {}
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await base44.entities.Inquiry.create({ ...form });
      setSent(true);
    } catch {}
    setBusy(false);
  };

  const label = "mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500";
  const field = "w-full border-b border-slate-300 bg-transparent pb-3 pt-1 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 focus:border-orange-400 focus:[box-shadow:0_4px_18px_-10px_rgba(255,159,28,0.5)]";

  return (
    <section id="contact" ref={ref} className="relative z-10 h-[240vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-white">
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-sky-200/50 blur-[140px]" />
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-orange-200/50 blur-[140px]" />

        <motion.div style={{ y }} className="relative mx-auto w-full max-w-6xl px-6">
          <div className="relative rounded-xl border border-slate-200 bg-white/80 shadow-2xl shadow-slate-200 backdrop-blur-2xl">
            <span className="absolute -left-px -top-px h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-orange-500" />
            <span className="absolute -right-px -top-px h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-sky-400/70" />
            <span className="absolute -bottom-px -left-px h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-sky-400/70" />
            <span className="absolute -bottom-px -right-px h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-orange-500" />
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-16">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gradient-to-r from-transparent to-orange-400/70" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-orange-500">Contact</p>
                  </div>
                  <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-[0.88] tracking-tighter text-slate-900 md:text-5xl">
                    Let&rsquo;s build<br />the <span className="gradient-text">next landmark</span>
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600">
                    Tell us about your construction, engineering, or development project. Our team responds within 24 hours.
                  </p>
                </div>

                <div className="mt-10 space-y-3">
                  {[
                    { icon: Mail, label: "projects@vertexsynergy.com", href: "mailto:projects@vertexsynergy.com" },
                    { icon: Phone, label: "+966 11 000 0000", href: "tel:+966110000000" },
                    { icon: MapPin, label: "Riyadh · Jeddah · Dammam" },
                  ].map(({ icon: Icon, label: l, href }) => (
                    <a key={l} href={href || "#"} className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 hover:border-orange-300 hover:bg-orange-50">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-orange-200 bg-white text-orange-500 transition-all duration-300 group-hover:border-orange-400 group-hover:shadow-[0_0_16px_-4px_rgba(255,159,28,0.5)]">
                        <Icon size={15} />
                      </span>
                      <span className="font-mono text-xs text-slate-600 transition-colors group-hover:text-slate-900">{l}</span>
                      <ArrowUpRight size={13} className="ml-auto text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 lg:border-l lg:border-t-0 lg:pl-16">
                {sent ? (
                  <div className="flex flex-col items-start gap-5 py-16">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-300 bg-orange-50 text-orange-500 shadow-[0_0_32px_-6px_rgba(255,159,28,0.4)]">
                      <CheckCircle2 size={30} />
                    </span>
                    <h3 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Transmission received.</h3>
                    <p className="max-w-sm text-sm text-slate-600">Our team will respond within 24 hours. Initiating project sequence…</p>
                    <button onClick={() => { setSent(false); setForm({}); }} className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-500 hover:underline">Send another →</button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                    <div>
                      <label className={label}>Full Name</label>
                      <input required placeholder="John Doe" className={field} onChange={(e) => set("full_name", e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>Company</label>
                      <input placeholder="Acme Corp" className={field} onChange={(e) => set("company", e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>Email</label>
                      <input required type="email" placeholder="john@acme.com" className={field} onChange={(e) => set("email", e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>Phone</label>
                      <input placeholder="+966 5X XXX XXXX" className={field} onChange={(e) => set("phone", e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>Project Type</label>
                      <select className={`${field} cursor-pointer`} onChange={(e) => set("project_type", e.target.value)} defaultValue="">
                        <option value="" disabled className="bg-white text-slate-900">Select type…</option>
                        {projectTypes.map((t) => <option key={t} value={t} className="bg-white text-slate-900">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={label}>Estimated Value</label>
                      <input placeholder="SAR 50M – 200M" className={field} onChange={(e) => set("estimated_value", e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>Location</label>
                      <input placeholder="Riyadh, KSA" className={field} onChange={(e) => set("location", e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>Attachment</label>
                      <label className="flex cursor-pointer items-center gap-2 pb-3 pt-1">
                        <FileText size={14} className="text-orange-500/70" />
                        <span className={`truncate text-sm ${form.file_url ? "text-slate-900" : "text-slate-400"}`}>{form.file_url ? "File attached" : "Attach file"}</span>
                        <input type="file" className="hidden" onChange={onFile} />
                        <span className="ml-auto h-px flex-1 border-b border-slate-200" />
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className={label}>Message</label>
                      <textarea required placeholder="Tell us about your project scope, timeline, and goals…" rows={3} className={`${field} resize-none`} onChange={(e) => set("message", e.target.value)} />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <button type="submit" disabled={busy} className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-orange-500 px-9 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-orange-600 disabled:opacity-50">
                        <Send size={14} /> {busy ? "Transmitting…" : "Submit Inquiry"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}