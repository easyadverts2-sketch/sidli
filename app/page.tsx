import Link from "next/link";
import Image from "next/image";
import { AnimatedTimeline } from "./components/animated-timeline";
import { BookingCalendar } from "./components/booking-calendar";
import { ChatWidget } from "./components/chat-widget";
import { CooperationPillars } from "./components/cooperation-pillars";
import { ServiceVisual } from "./components/service-visual";
import { SiteShell } from "./components/site-shell";
import { StatCounters } from "./components/stat-counters";
import { TestimonialsRotator } from "./components/testimonials-rotator";
import { services, siteConfig, testimonials } from "./lib/content";

const processSteps = [
  {
    icon: "☕",
    title: "Úvodní schůzka",
    text: "Společně se seznámíme, probereme finanční cíle a nastavíme parametry dlouhodobé spolupráce.",
  },
  {
    icon: "📊",
    title: "Finanční plán",
    text: "Na základě analýzy sestavím funkční plán a navrhnu individuální možnosti dalšího postupu.",
  },
  {
    icon: "✓",
    title: "Realizace",
    text: "Po dohodě plán uvedeme do praxe. Řešení vždy odpovídá vaší situaci i prioritám.",
  },
  {
    icon: "↻",
    title: "Pravidelný servis",
    text: "Spolupráce pokračuje i dál. Strategii upravujeme podle změn ve vašem životě i na trhu.",
  },
];

const stats = [
  { value: 6, suffix: "+ let", label: "ve financích" },
  { value: 200, suffix: "+", label: "klientů" },
  { value: 1033, suffix: "", label: "podepsaných smluv" },
];

const cooperationPillars = [
  {
    title: "Mentoring 1:1",
    description: "Pravidelné vedení nad schůzkami, obchodem i rozvojem tvé odbornosti.",
    icon: "🎯",
  },
  {
    title: "Ověřený systém",
    description: "Jasná struktura práce, procesy a nástroje, které fungují v praxi.",
    icon: "⚙️",
  },
  {
    title: "Růst bez stropu",
    description: "Posouvej svůj výkon každý měsíc, buduj sebejistotu a měň ambice na reálné výsledky.",
    icon: "🚀",
  },
];

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section id="uvod" className="hero-full section-screen">
          <div className="container-page flex w-full max-md:justify-start md:justify-end">
            <div className="hero-panel w-full max-w-[640px] shrink-0">
              <p className="mb-2 text-xs font-semibold tracking-[0.18em] uppercase text-primary sm:text-sm">
                {siteConfig.advisorTagline}
              </p>
              <h2 className="text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl md:text-6xl">
                Šidlichovský
                <br />
                Finance
              </h2>
              <p className="mt-3 text-xl font-semibold leading-snug text-foreground sm:mt-4 sm:text-2xl md:text-3xl">
                Finance, které drží tempo s vaším životem
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted sm:mt-4 sm:text-lg md:text-xl">
                Stavíme jasný finanční plán, který je přehledný, dlouhodobý a skutečně
                realizovatelný. Od prvního návrhu až po pravidelný servis.
              </p>
              <Link className="btn-primary mt-6 sm:mt-8" href="#kontakt">
                Chci se setkat
              </Link>
            </div>
          </div>
        </section>

        <section id="o-mne" className="section-screen">
          <div className="container-page split-help">
            <article>
              <p className="mb-2 text-sm font-semibold tracking-[0.2em] uppercase text-primary">
                Finance Šidlichovský
              </p>
              <h2 className="text-5xl font-bold text-foreground sm:text-6xl">Proč finanční poradce?</h2>
              <p className="mt-6 text-[1.35rem] leading-relaxed text-muted">
                Finanční poradce vám pomůže udělat lepší rozhodnutí napříč celým trhem,
                ne jen v jedné instituci. Zatímco bankéř obvykle nabízí hlavně produkty
                své banky, poradce porovnává více bank a hledá řešení, které dává smysl
                právě pro vaši situaci.
              </p>
              <p className="mt-4 text-[1.35rem] leading-relaxed text-muted">
                Pro klienta to znamená úsporu času, často i lepší podmínky a dlouhodobý
                plán, který drží i při změnách v životě. V řadě zemí je tento typ
                poradenství běžně placená služba, protože má jasnou přidanou hodnotu.
              </p>
              <Link className="btn-primary mt-8" href="#kontakt">
                Setkejme se
              </Link>
            </article>
            <div className="help-photo-wrap">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
                alt="Petr Šidlichovský"
                className="help-photo"
                width={900}
                height={1200}
              />
            </div>
          </div>
        </section>

        <section id="sluzby" className="container-page section-screen">
          <p className="mb-2 text-center text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Komplexní finanční poradenství
          </p>
          <h2 className="mb-10 text-center text-5xl font-bold text-foreground">Moje služby</h2>
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.title} className="service-panel">
                <ServiceVisual title={service.title} />
                <h3 className="mb-3 text-2xl font-semibold text-primary">{service.title}</h3>
                <p className="text-muted">{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="proces" className="container-page section-screen">
          <h2 className="section-title text-foreground">Jak pracuji</h2>
          <AnimatedTimeline steps={processSteps} />
          <StatCounters stats={stats} />
        </section>

        <section id="reference" className="reference-strip section-screen">
          <TestimonialsRotator testimonials={testimonials} />
        </section>

        <section id="spoluprace" className="container-page section-screen">
          <div className="cooperation-clean">
            <h2 className="text-center text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
              Spolupráce s Finance Šidlichovský
            </h2>
            <CooperationPillars pillars={cooperationPillars} />
            <div className="cooperation-cta mt-10 flex justify-center gap-3">
              <Link href="#kontakt" className="btn-primary cooperation-cta-btn">
                CHCI ZMĚNU
              </Link>
            </div>
            <p className="cooperation-mystic-text">
              Mám dva typy kolegů: jedni se mnou vzlétnou, druzí tvrdě narazí.
            </p>
          </div>
        </section>

        <section id="kontakt" className="container-page section-screen">
          <div className="grid gap-6 md:grid-cols-2">
            <form className="form-panel contact-plain">
              <h3 className="mb-4 text-xl font-semibold text-foreground">Kontaktní formulář</h3>
              <input className="form-field" placeholder="Jméno a příjmení" />
              <input className="form-field" placeholder="E-mail" />
              <input className="form-field" placeholder="Telefon" />
              <textarea className="form-field min-h-26" placeholder="Text zprávy" />
              <button type="button" className="btn-primary mt-1 w-fit">
                Odeslat
              </button>
            </form>
            <div className="contact-plain md:text-right">
              <p className="contact-art-line">{siteConfig.advisorName}</p>
              <p className="contact-art-line">{siteConfig.phone}</p>
              <p className="contact-art-line">{siteConfig.email}</p>
            </div>
          </div>
        </section>

        <section className="container-page pb-16">
          <p className="section-lead mb-5">{siteConfig.meetingAdminHint}</p>
          <BookingCalendar />
        </section>
        <ChatWidget />
      </main>
    </SiteShell>
  );
}
