"use client";

import { FormEvent, useEffect, useState } from "react";
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
    <div className="flex min-h-14 items-center gap-3 rounded-xl border border-sky-100 bg-[#f3f8fa] px-4 transition-colors focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
      <Icon className="h-5 w-5 shrink-0 text-cyan-500" strokeWidth={2.2} />
      {children}
    </div>
  );
}

function ContactDetail({ icon: Icon, title, value }: { icon: IconType; title: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="pt-0.5">
        <h2 className="text-base font-extrabold text-cyan-950 sm:text-lg">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base">{value}</p>
      </div>
    </div>
  );
}

export function ContactContent() {
  const [contactData, setContactData] = useState<ContactContentData>(DEFAULT_CONTACT_CONTENT);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  const inputClassName = "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400";

  return (
    <main id="contact" className="bg-[#f6fbfd] px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.97fr)_minmax(560px,1.03fr)] lg:items-start lg:gap-16">
        <section className="pt-2 lg:pt-8">
          <span className="inline-flex rounded-full bg-cyan-50 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-500">
            Start Planning
          </span>
          <h1 className="mt-6 max-w-xl font-serif-custom text-4xl font-bold leading-[1.08] tracking-tight text-cyan-950 sm:text-5xl lg:text-[3.25rem]">
            Ready for Your Lakshadweep Escape?
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Fill out the form to request a personalized quote and callback. Our island travel specialist will contact you within 2 hours with permit instructions and customized options.
          </p>

          <div className="mt-10 flex flex-col gap-7 sm:mt-12 sm:gap-8">
            <ContactDetail icon={MapPin} title="Head Office" value={contactData.address || DEFAULT_CONTACT_CONTENT.address} />
            <ContactDetail icon={Phone} title="Direct Phone & WhatsApp" value={`${contactData.phone || DEFAULT_CONTACT_CONTENT.phone} / WhatsApp: ${contactData.whatsapp || DEFAULT_CONTACT_CONTENT.whatsapp}`} />
            <ContactDetail icon={Mail} title="Email Support" value={contactData.email || DEFAULT_CONTACT_CONTENT.email} />
            <ContactDetail icon={Clock3} title="Business Hours" value={contactData.businessHours || DEFAULT_CONTACT_CONTENT.businessHours} />
          </div>
        </section>

        <section className="rounded-[26px] border border-sky-100 bg-white p-6 shadow-[0_16px_50px_rgba(8,58,90,0.08)] sm:p-8 lg:p-10">
          <h2 className="font-serif-custom text-3xl font-bold leading-tight text-cyan-950 sm:text-4xl">Book Your Package Enquiry</h2>
          <p className="mt-2 text-base text-slate-500">Get instant callback &amp; entry permit details</p>

          <form onSubmit={handleSubmit} noValidate suppressHydrationWarning className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-800">Full Name *</label>
              <FieldShell icon={UserRound}>
                <input id="name" suppressHydrationWarning value={values.name} onChange={(event) => updateValue("name", event.target.value)} className={inputClassName} />
              </FieldShell>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-800">Phone Number (WhatsApp) *</label>
                <FieldShell icon={Phone}>
                  <input id="phone" suppressHydrationWarning type="tel" value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} className={inputClassName} />
                </FieldShell>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">Email Address *</label>
                <FieldShell icon={Mail}>
                  <input id="email" suppressHydrationWarning type="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} className={inputClassName} />
                </FieldShell>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="travelDate" className="mb-2 block text-sm font-bold text-slate-800">Preferred Travel Date *</label>
                <FieldShell icon={CalendarDays}>
                  <input id="travelDate" suppressHydrationWarning type="date" value={values.travelDate} onChange={(event) => updateValue("travelDate", event.target.value)} className={`${inputClassName} ${values.travelDate ? "text-slate-800" : "text-slate-400"}`} />
                </FieldShell>
                {errors.travelDate && <p className="mt-1 text-xs text-red-600">{errors.travelDate}</p>}
              </div>
              <div>
                <label htmlFor="travelers" className="mb-2 block text-sm font-bold text-slate-800">Number of Travelers *</label>
                <FieldShell icon={UsersRound}>
                  <select id="travelers" suppressHydrationWarning value={values.travelers} onChange={(event) => updateValue("travelers", event.target.value)} className={`${inputClassName} ${values.travelers ? "text-slate-800" : "text-slate-400"}`}>
                    <option value="">Select travelers</option>
                    {TRAVELER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </FieldShell>
                {errors.travelers && <p className="mt-1 text-xs text-red-600">{errors.travelers}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="packageName" className="mb-2 block text-sm font-bold text-slate-800">Preferred Package *</label>
              <FieldShell icon={BriefcaseBusiness}>
                <select id="packageName" suppressHydrationWarning value={values.packageName} onChange={(event) => updateValue("packageName", event.target.value)} className={`${inputClassName} ${values.packageName ? "text-slate-800" : "text-slate-400"}`}>
                  {PACKAGE_OPTIONS.map((option) => <option key={option} value={option === PACKAGE_OPTIONS[0] ? "" : option}>{option}</option>)}
                </select>
              </FieldShell>
              {errors.packageName && <p className="mt-1 text-xs text-red-600">{errors.packageName}</p>}
            </div>

            <div>
              <label htmlFor="accommodationType" className="mb-2 block text-sm font-bold text-slate-800">Accommodation Type</label>
              <FieldShell icon={Hotel}>
                <select id="accommodationType" suppressHydrationWarning value={values.accommodationType} onChange={(event) => updateValue("accommodationType", event.target.value)} className={`${inputClassName} ${values.accommodationType ? "text-slate-800" : "text-slate-400"}`}>
                  {ACCOMMODATION_OPTIONS.map((option) => <option key={option} value={option === ACCOMMODATION_OPTIONS[0] ? "" : option}>{option}</option>)}
                </select>
              </FieldShell>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-800">Special Requirements / Message</label>
              <textarea id="message" suppressHydrationWarning value={values.message} onChange={(event) => updateValue("message", event.target.value)} placeholder="Tell us about your travel plans, preferences or special requirements..." className="min-h-[130px] w-full resize-y rounded-xl border border-sky-100 bg-[#f3f8fa] px-4 py-3 text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            </div>

            <button type="submit" suppressHydrationWarning className="mt-1 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-sky-700 px-6 text-base font-bold text-white shadow-lg shadow-sky-900/10 transition-colors hover:bg-sky-800">
              Request Package Enquiry <ArrowRight className="h-5 w-5" />
            </button>
            {submitted && <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">Thank you. Our travel specialist will contact you shortly.</p>}
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
