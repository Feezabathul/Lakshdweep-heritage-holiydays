"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Edit3,
  Globe,
  HelpCircle,
  Home,
  Info,
  Mail,
  Plus,
  Phone,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import AdminBadge from "@/components/admin/AdminBadge";
import AdminButton from "@/components/admin/AdminButton";
import {
  AboutContent,
  ContactContentData,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_CONTACT_CONTENT,
  DEFAULT_HOMEPAGE_CONTENT,
  FAQItem,
  getAboutContent,
  getContactContent,
  getFaqs,
  getHomepageContent,
  HomepageContent,
  addFaq,
  deleteFaq,
  reorderFaqs,
  saveAboutContent,
  saveContactContent,
  saveHomepageContent,
  seedDefaultContent,
  updateFaq,
} from "@/lib/content";

type TabType = "homepage" | "about" | "faq" | "contact";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("homepage");

  // State for content sections
  const [homepage, setHomepage] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [contact, setContact] = useState<ContactContentData>(DEFAULT_CONTACT_CONTENT);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Page level state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // FAQ Modal state
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqSearch, setFaqSearch] = useState("");

  // Load all content
  const loadAllData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const [hpData, abData, ctData, faqData] = await Promise.all([
        getHomepageContent(),
        getAboutContent(),
        getContactContent(),
        getFaqs(false),
      ]);
      setHomepage(hpData);
      setAbout(abData);
      setContact(ctData);
      setFaqs(faqData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load content";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAllData();
  }, []);

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Handlers for Homepage save
  const handleSaveHomepage = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    const res = await saveHomepageContent(homepage);
    setIsSaving(false);
    if (res.success) {
      notifySuccess("Homepage content updated successfully!");
    } else {
      setErrorMsg(res.error || "Failed to save Homepage content.");
    }
  };

  // Handlers for About Us save
  const handleSaveAbout = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    const res = await saveAboutContent(about);
    setIsSaving(false);
    if (res.success) {
      notifySuccess("About Us content updated successfully!");
    } else {
      setErrorMsg(res.error || "Failed to save About Us content.");
    }
  };

  // Handlers for Contact save
  const handleSaveContact = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    const res = await saveContactContent(contact);
    setIsSaving(false);
    if (res.success) {
      notifySuccess("Contact details updated successfully!");
    } else {
      setErrorMsg(res.error || "Failed to save Contact content.");
    }
  };

  // FAQ Modal Handlers
  const openAddFaqModal = () => {
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    setIsSaving(true);
    setErrorMsg("");

    if (editingFaq) {
      const res = await updateFaq(editingFaq.id, {
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
      });
      if (res.success) {
        setFaqModalOpen(false);
        notifySuccess("FAQ updated successfully!");
        void loadAllData();
      } else {
        setErrorMsg(res.error || "Failed to update FAQ.");
      }
    } else {
      const res = await addFaq(faqQuestion.trim(), faqAnswer.trim());
      if (res.success) {
        setFaqModalOpen(false);
        notifySuccess("New FAQ added successfully!");
        void loadAllData();
      } else {
        setErrorMsg(res.error || "Failed to add FAQ.");
      }
    }
    setIsSaving(false);
  };

  const handleDeleteFaq = async (faq: FAQItem) => {
    if (!window.confirm(`Delete question: "${faq.question}"?`)) return;
    setIsSaving(true);
    const res = await deleteFaq(faq.id);
    setIsSaving(false);
    if (res.success) {
      notifySuccess("FAQ deleted.");
      void loadAllData();
    } else {
      setErrorMsg(res.error || "Failed to delete FAQ.");
    }
  };

  const handleToggleFaqStatus = async (faq: FAQItem) => {
    const nextStatus = !faq.is_enabled;
    const res = await updateFaq(faq.id, { is_enabled: nextStatus });
    if (res.success) {
      setFaqs((current) =>
        current.map((item) => (item.id === faq.id ? { ...item, is_enabled: nextStatus } : item))
      );
      notifySuccess(`FAQ ${nextStatus ? "enabled" : "disabled"}.`);
    } else {
      setErrorMsg(res.error || "Failed to toggle status.");
    }
  };

  const handleMoveFaq = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;

    setFaqs(newFaqs);
    const res = await reorderFaqs(newFaqs);
    if (res.success) {
      notifySuccess("FAQ order saved.");
    } else {
      setErrorMsg(res.error || "Failed to reorder FAQs.");
      void loadAllData();
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm("Seed default website content into database? This will update empty entries with default text.")) return;
    setIsSaving(true);
    const res = await seedDefaultContent();
    setIsSaving(false);
    if (res.success) {
      notifySuccess("Default content seeded into Supabase!");
      void loadAllData();
    } else {
      setErrorMsg(res.error || "Failed to seed default content.");
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      !faqSearch.trim() ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Publishing & Editor</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Website Content</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage public text, headings, About Us, FAQs, and Contact details stored in Supabase.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AdminButton variant="secondary" onClick={() => void handleSeedDefaults()} disabled={isSaving}>
            <RotateCcw className="h-4 w-4" /> Seed / Restore Defaults
          </AdminButton>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-3 pt-3 rounded-t-xl">
        {[
          { id: "homepage", label: "Homepage", icon: Home },
          { id: "about", label: "About Us", icon: Info },
          { id: "faq", label: "FAQ", icon: HelpCircle },
          { id: "contact", label: "Contact", icon: Phone },
        ].map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`flex items-center gap-2.5 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                active
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Loading website content from Supabase...
        </div>
      ) : (
        <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white p-6 shadow-sm">
          {/* TAB 1: HOMEPAGE */}
          {activeTab === "homepage" && (
            <form onSubmit={handleSaveHomepage} className="max-w-4xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Homepage Hero &amp; Sections</h3>
                <p className="mt-1 text-xs text-slate-500">Customize the main hero title, description, call-to-action, and summary sections.</p>
              </div>

              <div className="space-y-4">
                <Field
                  label="Hero Heading"
                  value={homepage.heroHeading}
                  onChange={(val) => setHomepage((prev) => ({ ...prev, heroHeading: val }))}
                  required
                />

                <TextAreaField
                  label="Hero Description"
                  value={homepage.heroDescription}
                  onChange={(val) => setHomepage((prev) => ({ ...prev, heroDescription: val }))}
                  rows={3}
                  required
                />

                <Field
                  label="CTA Button Text"
                  value={homepage.ctaText}
                  onChange={(val) => setHomepage((prev) => ({ ...prev, ctaText: val }))}
                  required
                />

                <TextAreaField
                  label="About Section Summary Text (Homepage)"
                  value={homepage.aboutText}
                  onChange={(val) => setHomepage((prev) => ({ ...prev, aboutText: val }))}
                  rows={3}
                  required
                />

                <TextAreaField
                  label="Why Choose Us Content (Homepage)"
                  value={homepage.whyChooseUs}
                  onChange={(val) => setHomepage((prev) => ({ ...prev, whyChooseUs: val }))}
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <AdminButton type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Homepage Content"}
                </AdminButton>
              </div>
            </form>
          )}

          {/* TAB 2: ABOUT US */}
          {activeTab === "about" && (
            <form onSubmit={handleSaveAbout} className="max-w-4xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">About Us Page Content</h3>
                <p className="mt-1 text-xs text-slate-500">Update main About Us headline, story description, and featured showcase image.</p>
              </div>

              <div className="space-y-4">
                <Field
                  label="Main Heading"
                  value={about.heading}
                  onChange={(val) => setAbout((prev) => ({ ...prev, heading: val }))}
                  required
                />

                <TextAreaField
                  label="Detailed Story / Description"
                  value={about.description}
                  onChange={(val) => setAbout((prev) => ({ ...prev, description: val }))}
                  rows={6}
                  required
                />

                <div>
                  <Field
                    label="Featured Image URL"
                    type="url"
                    value={about.image}
                    placeholder="https://..."
                    onChange={(val) => setAbout((prev) => ({ ...prev, image: val }))}
                    required
                  />
                  {about.image && (
                    <div className="mt-3 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <img
                        src={about.image}
                        alt="About Us Preview"
                        className="h-20 w-32 rounded-lg object-cover shadow-sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Image Preview</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-md">{about.image}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <AdminButton type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save About Content"}
                </AdminButton>
              </div>
            </form>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
                  <p className="mt-1 text-xs text-slate-500">Add, reorder, edit, or toggle questions visible on public FAQ sections.</p>
                </div>
                <AdminButton onClick={openAddFaqModal}>
                  <Plus className="h-4 w-4" /> Add Question
                </AdminButton>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search questions or answers..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Order</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Question &amp; Answer</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Reorder</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredFaqs.map((faq, index) => (
                      <tr key={faq.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-4 text-xs font-bold text-slate-500">
                          #{faq.display_order ?? index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-900 text-sm">{faq.question}</p>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">{faq.answer}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <button onClick={() => void handleToggleFaqStatus(faq)}>
                            <AdminBadge tone={faq.is_enabled ? "teal" : "slate"}>
                              {faq.is_enabled ? "Enabled" : "Disabled"}
                            </AdminBadge>
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              disabled={index === 0}
                              onClick={() => void handleMoveFaq(index, "up")}
                              aria-label="Move Up"
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              disabled={index === faqs.length - 1}
                              onClick={() => void handleMoveFaq(index, "down")}
                              aria-label="Move Down"
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditFaqModal(faq)}
                              aria-label="Edit Question"
                              className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => void handleDeleteFaq(faq)}
                              aria-label="Delete Question"
                              className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredFaqs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                          No questions found. Add your first question above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === "contact" && (
            <form onSubmit={handleSaveContact} className="max-w-4xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Contact &amp; Business Information</h3>
                <p className="mt-1 text-xs text-slate-500">Update main office phone numbers, WhatsApp line, email address, physical location, and operating hours.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Phone Number"
                  value={contact.phone}
                  onChange={(val) => setContact((prev) => ({ ...prev, phone: val }))}
                  required
                />

                <Field
                  label="WhatsApp Number"
                  value={contact.whatsapp}
                  onChange={(val) => setContact((prev) => ({ ...prev, whatsapp: val }))}
                  required
                />

                <Field
                  label="Email Address"
                  type="email"
                  value={contact.email}
                  onChange={(val) => setContact((prev) => ({ ...prev, email: val }))}
                  required
                />

                <Field
                  label="Business Hours"
                  value={contact.businessHours}
                  placeholder="Mon – Sat: 8:00 AM – 9:00 PM IST"
                  onChange={(val) => setContact((prev) => ({ ...prev, businessHours: val }))}
                  required
                />
              </div>

              <TextAreaField
                label="Physical Address"
                value={contact.address}
                onChange={(val) => setContact((prev) => ({ ...prev, address: val }))}
                rows={3}
                required
              />

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <AdminButton type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Contact Info"}
                </AdminButton>
              </div>
            </form>
          )}
        </div>
      )}

      {/* FAQ Edit/Add Modal */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="font-bold text-slate-900">{editingFaq ? "Edit Question" : "Add New FAQ Question"}</h3>
              <button onClick={() => setFaqModalOpen(false)} aria-label="Close Modal" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-4 p-6">
              <Field
                label="Question"
                value={faqQuestion}
                onChange={setFaqQuestion}
                placeholder="e.g. How do I get an entry permit?"
                required
              />
              <TextAreaField
                label="Answer"
                value={faqAnswer}
                onChange={setFaqAnswer}
                placeholder="Enter detailed answer here..."
                rows={4}
                required
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <AdminButton type="button" variant="secondary" onClick={() => setFaqModalOpen(false)} disabled={isSaving}>
                  Cancel
                </AdminButton>
                <AdminButton type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingFaq ? "Save changes" : "Add FAQ"}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <textarea
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}