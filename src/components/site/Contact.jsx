import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { COMPANY, PROJECT_TYPES } from "@/lib/content";
import { base44 } from "@/api/base44Client";

export default function Contact() {
  const [form, setForm] = useState({ full_name: "", company: "", email: "", phone: "", project_type: "Electrical", location: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setErr("");
    setSending(true);
    try {
      await base44.entities.Inquiry.create(form);
      setSent(true);
      setForm({ full_name: "", company: "", email: "", phone: "", project_type: "Electrical", location: "", message: "" });
    } catch (e2) {
      setErr("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative px-6 py-28 md:px-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Contact</span>
            <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">Let's Build Better Systems Together</h2>
            <p className="mt-4 text-slate-400">Tell us about your project and our team will respond to discuss how Vertex Synergy can support your engineering and construction goals.</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/40 text-amber-400"><MapPin size={18} /></div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Headquarters</div>
                  <div className="text-slate-200">{COMPANY.location}</div>
                </div>
              </div>
              <a href={COMPANY.phoneHref} className="flex items-start gap-3 transition-colors hover:text-amber-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/40 text-amber-400"><Phone size={18} /></div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Phone</div>
                  <div className="text-slate-200">{COMPANY.phone}</div>
                </div>
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-start gap-3 transition-colors hover:text-amber-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/40 text-amber-400"><Mail size={18} /></div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Email</div>
                  <div className="text-slate-200">{COMPANY.email}</div>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={submit} className="rounded-2xl border border-slate-700/40 bg-[#0b0f1a]/80 p-6 md:p-8">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-400"><Send size={24} /></div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-white">Enquiry Submitted</h3>
                  <p className="mt-2 text-sm text-slate-400">Thank you. Our team will be in touch shortly.</p>
                  <button type="button" onClick={() => setSent(false)} className="mt-6 rounded-full border border-slate-600/60 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-300 hover:text-amber-300">Send another</button>
                </motion.div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" required value={form.full_name} onChange={set("full_name")} />
                  <Field label="Company" value={form.company} onChange={set("company")} />
                  <Field label="Email" type="email" required value={form.email} onChange={set("email")} />
                  <Field label="Phone" value={form.phone} onChange={set("phone")} />
                  <div>
                    <Label>Project Type</Label>
                    <select value={form.project_type} onChange={set("project_type")} className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 focus:border-amber-500/60 focus:outline-none">
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <Field label="Project Location" value={form.location} onChange={set("location")} />
                  <div className="sm:col-span-2">
                    <Label>Message</Label>
                    <textarea value={form.message} onChange={set("message")} rows={4} required className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 focus:border-amber-500/60 focus:outline-none" />
                  </div>
                  {err && <p className="sm:col-span-2 text-sm text-red-400">{err}</p>}
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 transition-all hover:bg-amber-400 disabled:opacity-60">
                      {sending ? "Submitting…" : "Submit Enquiry"} <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const Label = ({ children }) => <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-slate-500">{children}</label>;
const Field = ({ label, type = "text", required, value, onChange }) => (
  <div>
    <Label>{label}{required && <span className="text-amber-400"> *</span>}</Label>
    <input type={type} required={required} value={value} onChange={onChange}
      className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 focus:border-amber-500/60 focus:outline-none" />
  </div>
);