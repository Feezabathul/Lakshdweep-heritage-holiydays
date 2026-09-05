"use client";

import { MouseEvent, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, PhoneCall } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", sectionId: "home", route: "/" },
  { label: "Packages", sectionId: "packages", route: "/packages" },
  { label: "Accommodation", sectionId: "accommodation", route: "/accommodation" },
  { label: "Why Choose Us", sectionId: "why-choose-us" },
  { label: "Experiences", sectionId: "experiences" },
  { label: "About Us", sectionId: "about", route: "/about" },
  { label: "FAQ", sectionId: "faq", route: "/faq" },
  { label: "Contact", sectionId: "contact", route: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") {
      const activePage = NAV_ITEMS.find((item) => item.route === pathname);
      setActiveSection(activePage?.sectionId ?? "");
      return;
    }

    setActiveSection("home");
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.sectionId)).filter(
      (section): section is HTMLElement => section !== null,
    );
    const updateActiveSection = () => {
      const headerOffset = 96;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActiveSection("contact");
        return;
      }

      const visibleSection = sections.reduce<HTMLElement | null>((current, section) => {
        if (section.getBoundingClientRect().top <= headerOffset) {
          return section;
        }
        return current;
      }, null);

      setActiveSection(visibleSection?.id ?? "home");
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: "-96px 0px -45% 0px",
      threshold: [0, 0.15, 0.5],
    });
    sections.forEach((section) => observer.observe(section));
    updateActiveSection();

    const handleScroll = () => {
      updateActiveSection();
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const getHref = (sectionId: string, route?: string) => {
    if (pathname === "/") {
      return `/#${sectionId}`;
    }
    return route ?? `/#${sectionId}`;
  };

  const activateItem = (sectionId: string) => {
    if (pathname === "/") {
      setActiveSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  const handleNavigationClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (pathname !== "/") {
      activateItem(sectionId);
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) {
      activateItem(sectionId);
      return;
    }

    event.preventDefault();
    activateItem(sectionId);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  return (
    <header
      suppressHydrationWarning
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-sky-100"
          : "bg-white/90 py-4 border-b border-sky-100/80"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-4">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 via-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight group-hover:text-sky-700 transition-colors whitespace-nowrap">
              Lakshadweep <span className="text-sky-600 font-extrabold">Heritage Holidays</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-1 xl:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.sectionId;
            return (
              <Link
                key={item.label}
                href={getHref(item.sectionId, item.route)}
                onClick={(event) => handleNavigationClick(event, item.sectionId)}
                className={`px-2.5 xl:px-3.5 py-2 text-sm font-medium transition-all relative whitespace-nowrap ${
                  isActive
                    ? "text-sky-700 font-semibold"
                    : "text-slate-700 hover:text-sky-700 hover:bg-sky-50/50 rounded-lg"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 xl:left-3.5 xl:right-3.5 h-0.5 bg-sky-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden lg:flex items-center shrink-0">
          <Link
            href="/#planner"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-700 to-cyan-600 hover:from-sky-800 hover:to-cyan-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-sky-900/10 hover:shadow-lg hover:shadow-sky-900/20 transition-all transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-sky-100" />
            <span>PLAN YOUR DREAM TRIP</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl py-4 px-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={getHref(item.sectionId, item.route)}
                onClick={(event) => handleNavigationClick(event, item.sectionId)}
                className={`py-2.5 px-3 text-base font-medium rounded-lg transition-colors ${
                  activeSection === item.sectionId
                    ? "text-sky-700 font-semibold bg-sky-50"
                    : "text-slate-700 hover:text-sky-700 hover:bg-sky-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href="/#planner"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-sky-700 hover:bg-sky-800 text-white font-semibold py-3 rounded-xl shadow-md transition-colors"
              >
                PLAN YOUR DREAM TRIP
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
