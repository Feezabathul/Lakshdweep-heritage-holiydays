"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Hotel,
  Mail,
  MapPin,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";
import { ContactContentData, DEFAULT_CONTACT_CONTENT, getContactContent } from "@/lib/content";

const PACKAGE_OPTIONS = [
  "Select a package...",
  "Kalpeni Island Adventure Package (3N / 4D)",
  "Agatti Island Adventure Package (3N / 4D)",
  "Honeymoon in Paradise.(Agatti/ Kavaratti/ Kalpeni) (3N / 4D)",
  "Family Island Holiday(Agatti/ Kavaratti/Kalpeni). (3N / 4D)",
];

const ACCOMMODATION_OPTIONS = [
  "Select accommodation type...",
  "Homestay",
  "Resort",
  "Standard Rooms",
];

const TRAVELER_OPTIONS = ["1 Person", "2 People", "3-4 People", "5+ People"];

type FormValues = {
  name: string;
  phone: string;
  email: string;
  travelDate: string;
  travelers: string;
  packageName: string;
  accommodationType: string;
  message: string;
};

const INITIAL_VALUES: FormValues = {
  name: "",
  phone: "",
  email: "",
  travelDate: "",
  travelers: "",
  packageName: "",
  accommodationType: "",
  message: "",
};

type IconType = typeof UserRound;

function FieldShell({ icon: Icon, children }: { icon: IconType; children: React.ReactNode }) {
  return (
    <div className="flex min-h-10 items-center gap-2.5 rounded-xl border border-sky-100 bg-[#f3f8fa] px-3.5 transition-colors focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
      <Icon className="h-4 w-4 shrink-0 text-cyan-500" strokeWidth={2.2} />
      {children}
    </div>
  );
}

function ContactDetail({ icon: Icon, title, value }: { icon: IconType; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <div className="pt-0.5">
        <h2 className="text-sm font-bold text-cyan-950 sm:text-base">{title}</h2>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">{value}</p>
      </div>
    </div>
  );
}

export function ContactContent() {
  const [contactData, setContactData] = useState<ContactContentData>(DEFAULT_CONTACT_CONTENT);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void getContactContent().then(setContactData);
  }, []);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = "Please enter your full name.";
    if (!/^\+?[0-9\s()-]{10,}$/.test(values.phone.trim())) nextErrors.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!values.travelDate) nextErrors.travelDate = "Choose your preferred travel date.";
    if (!values.travelers) nextErrors.travelers = "Select the number of travelers.";
    if (!values.packageName) nextErrors.packageName = "Select a preferred package.";
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    setSubmitError("");
    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      customer_name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      travel_date: values.travelDate || null,
      travelers: values.travelers,
      package_name: values.packageName,
      accommodation_type: values.accommodationType,
      message: values.message.trim(),
      permit_status: "Pending",
      status: "Pending",
    });

    if (error) {
      setSubmitError("Sorry, we could not submit your enquiry. Please try again or contact us directly.");
    } else {
      setSubmitted(true);
      setValues(INITIAL_VALUES);
    }
    setIsSaving(false);
  };

  const inputClassName = "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400";

  return (
    <main id="contact" className="bg-[#f6fbfd] px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.97fr)_minmax(520px,1.03fr)] lg:items-start lg:gap-12">
        <section className="pt-1 lg:pt-4">
          <span className="inline-flex rounded-full bg-cyan-50 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cyan-500">
            Start Planning
          </span>
          <h1 className="mt-3 max-w-xl font-serif-custom text-3xl font-bold leading-[1.1] tracking-tight text-cyan-950 sm:text-4xl lg:text-[2.5rem]">
            Ready for Your Lakshadweep Escape?
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Fill out the form to request a personalized quote and callback. Our island travel specialist will contact you within 2 hours with permit instructions and customized options.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
            <ContactDetail icon={MapPin} title="Head Office" value={contactData.address || DEFAULT_CONTACT_CONTENT.address} />
            <ContactDetail icon={Phone} title="Direct Phone & WhatsApp" value={`${contactData.phone || DEFAULT_CONTACT_CONTENT.phone} / WhatsApp: ${contactData.whatsapp || DEFAULT_CONTACT_CONTENT.whatsapp}`} />
            <ContactDetail icon={Mail} title="Email Support" value={contactData.email || DEFAULT_CONTACT_CONTENT.email} />
            <ContactDetail icon={Clock3} title="Business Hours" value={contactData.businessHours || DEFAULT_CONTACT_CONTENT.businessHours} />
          </div>
        </section>

        <section className="rounded-[22px] border border-sky-100 bg-white p-5 shadow-[0_12px_40px_rgba(8,58,90,0.06)] sm:p-6 lg:p-7">
          <h2 className="font-serif-custom text-2xl font-bold leading-tight text-cyan-950 sm:text-3xl">Book Your Package Enquiry</h2>
          <p className="mt-1 text-sm text-slate-500">Get instant callback &amp; entry permit details</p>

          <form onSubmit={handleSubmit} noValidate suppressHydrationWarning className="mt-5 flex flex-col gap-3.5">
            <div>
              <label htmlFor="name" className="mb-1 block text-xs font-bold text-slate-800">Full Name *</label>
              <FieldShell icon={UserRound}>
                <input id="name" suppressHydrationWarning value={values.name} onChange={(event) => updateValue("name", event.target.value)} className={inputClassName} />
              </FieldShell>
              {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-xs font-bold text-slate-800">Phone Number (WhatsApp) *</label>
                <FieldShell icon={Phone}>
                  <input id="phone" suppressHydrationWarning type="tel" value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} className={inputClassName} />
                </FieldShell>
                {errors.phone && <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-bold text-slate-800">Email Address *</label>
                <FieldShell icon={Mail}>
                  <input id="email" suppressHydrationWarning type="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} className={inputClassName} />
                </FieldShell>
                {errors.email && <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="travelDate" className="mb-1 block text-xs font-bold text-slate-800">Preferred Travel Date *</label>
                <FieldShell icon={CalendarDays}>
                  <input id="travelDate" suppressHydrationWarning type="date" value={values.travelDate} onChange={(event) => updateValue("travelDate", event.target.value)} className={`${inputClassName} ${values.travelDate ? "text-slate-800" : "text-slate-400"}`} />
                </FieldShell>
                {errors.travelDate && <p className="mt-0.5 text-xs text-red-600">{errors.travelDate}</p>}
              </div>
              <div>
                <label htmlFor="travelers" className="mb-1 block text-xs font-bold text-slate-800">Number of Travelers *</label>
                <FieldShell icon={UsersRound}>
                  <select id="travelers" suppressHydrationWarning value={values.travelers} onChange={(event) => updateValue("travelers", event.target.value)} className={`${inputClassName} ${values.travelers ? "text-slate-800" : "text-slate-400"}`}>
                    <option value="">Select travelers</option>
                    {TRAVELER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </FieldShell>
                {errors.travelers && <p className="mt-0.5 text-xs text-red-600">{errors.travelers}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="packageName" className="mb-1 block text-xs font-bold text-slate-800">Preferred Package *</label>
              <FieldShell icon={BriefcaseBusiness}>
                <select id="packageName" suppressHydrationWarning value={values.packageName} onChange={(event) => updateValue("packageName", event.target.value)} className={`${inputClassName} ${values.packageName ? "text-slate-800" : "text-slate-400"}`}>
                  {PACKAGE_OPTIONS.map((option) => <option key={option} value={option === PACKAGE_OPTIONS[0] ? "" : option}>{option}</option>)}
                </select>
              </FieldShell>
              {errors.packageName && <p className="mt-0.5 text-xs text-red-600">{errors.packageName}</p>}
            </div>

            <div>
              <label htmlFor="accommodationType" className="mb-1 block text-xs font-bold text-slate-800">Accommodation Type</label>
              <FieldShell icon={Hotel}>
                <select id="accommodationType" suppressHydrationWarning value={values.accommodationType} onChange={(event) => updateValue("accommodationType", event.target.value)} className={`${inputClassName} ${values.accommodationType ? "text-slate-800" : "text-slate-400"}`}>
                  {ACCOMMODATION_OPTIONS.map((option) => <option key={option} value={option === ACCOMMODATION_OPTIONS[0] ? "" : option}>{option}</option>)}
                </select>
              </FieldShell>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-xs font-bold text-slate-800">Special Requirements / Message</label>
              <textarea id="message" suppressHydrationWarning value={values.message} onChange={(event) => updateValue("message", event.target.value)} placeholder="Tell us about your travel plans, preferences or special requirements..." className="min-h-[72px] w-full resize-y rounded-xl border border-sky-100 bg-[#f3f8fa] px-3.5 py-2 text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            </div>

            <button type="submit" disabled={isSaving} suppressHydrationWarning className="mt-0.5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-6 text-sm font-bold text-white shadow-md shadow-sky-900/10 transition-colors hover:bg-sky-800 disabled:opacity-60 disabled:cursor-not-allowed">
              {isSaving ? "Submitting..." : (<>Request Package Enquiry <ArrowRight className="h-4 w-4" /></>)}
            </button>
            {submitted && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700">Thank you! Our travel specialist will contact you shortly.</p>}
            {submitError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-700">{submitError}</p>}
          </form>
        </section>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6fbfd]">
      <Header />
      <ContactContent />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
