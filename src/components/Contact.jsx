import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin, Linkedin, Upload, CheckCircle2 } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

const enquiryTypes = ["Business Enquiry", "Request for Quotation", "Careers", "Partnership"];
const projectTypes = ["Civil Works", "MEP Works", "Turnkey / Fit-Out", "Temporary Facility", "Infrastructure", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", enquiry: enquiryTypes[0], project: projectTypes[0], message: "" });
  const [fileName, setFileName] = useState("");
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const inputCls = "w-full bg-transparent border-b border-border focus:border-accent transition-colors py-3 text-foreground placeholder:text-muted-foreground/50 outline-none";

  return (
    <section id="contact" className="relative bg-background py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[160px]" />
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left */}
          <div className="lg:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">09 / Contact</div>
            <h2 className="font-heading font-bold tracking-tighter text-5xl md:text-7xl mb-6">
              Let's build<br /><span className="text-accent">something.</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md">
              Submit your enquiry. Our team responds within 48 hours with a tailored response.
            </p>

            <div className="space-y-5">
              <a href="tel:+966566424971" className="flex items-center gap-4 group">
                <div className="w-11 h-11 glass rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors">
                  <Phone size={17} className="group-hover:text-accent-foreground transition-colors" />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Phone</div>
                  <div className="text-foreground group-hover:text-accent transition-colors">+966 56 642 4971</div>
                </div>
              </a>
              <a href="mailto:Info@vsyenergy.com" className="flex items-center gap-4 group">
                <div className="w-11 h-11 glass rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors">
                  <Mail size={17} className="group-hover:text-accent-foreground transition-colors" />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Email</div>
                  <div className="text-foreground group-hover:text-accent transition-colors">Info@vsyenergy.com</div>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 glass rounded-xl flex items-center justify-center">
                  <MapPin size={17} />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Headquarters</div>
                  <div className="text-foreground">Jeddah · Makkah 23453, Saudi Arabia</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <a href="https://www.linkedin.com/company/vertex-synergy-co" target="_blank" rel="noreferrer" data-hover className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:border-accent transition-colors">
                <Linkedin size={17} />
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-6 lg:col-start-7">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[440px]"
              >
                <CheckCircle2 size={48} className="text-accent mb-5" />
                <h3 className="font-heading font-bold tracking-tighter text-3xl mb-3">Enquiry received.</h3>
                <p className="text-muted-foreground max-w-sm">Thank you, {form.name || "there"}. Our team will review your submission and respond within 48 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 font-mono text-[10px] uppercase tracking-widest text-accent">Send another →</button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Full Name *</label>
                    <input required value={form.name} onChange={update("name")} placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Company Name</label>
                    <input value={form.company} onChange={update("company")} placeholder="Company" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Email *</label>
                    <input type="email" required value={form.email} onChange={update("email")} placeholder="you@company.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Phone</label>
                    <input value={form.phone} onChange={update("phone")} placeholder="+966 ..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Enquiry Type</label>
                    <select value={form.enquiry} onChange={update("enquiry")} className={`${inputCls} appearance-none`}>
                      {enquiryTypes.map((t) => <option key={t} className="bg-card">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Project Type</label>
                    <select value={form.project} onChange={update("project")} className={`${inputCls} appearance-none`}>
                      {projectTypes.map((t) => <option key={t} className="bg-card">{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Message *</label>
                  <textarea required rows={4} value={form.message} onChange={update("message")} placeholder="Tell us about your project..." className={`${inputCls} resize-none`} />
                </div>
                <label className="flex items-center gap-3 cursor-none">
                  <div className="w-11 h-11 glass rounded-xl flex items-center justify-center">
                    <Upload size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Attach File (optional)</div>
                    <div className="text-sm text-foreground/70">{fileName || "Choose a file..."}</div>
                  </div>
                  <input type="file" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} className="hidden" />
                </label>
                <MagneticButton
                  type="submit"
                  strength={0.15}
                  whileHover={{ backgroundColor: "#FF6A1A" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-foreground text-background py-5 rounded-full font-mono text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3"
                >
                  Submit Enquiry <Send size={15} />
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}