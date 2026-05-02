import { SiteShell } from "../components/site-shell";
import { services } from "../lib/content";

export default function ServicesPage() {
  return (
    <SiteShell>
      <main className="container-page py-16">
        <h1 className="section-title">Moje služby</h1>
        <p className="section-lead mb-8">
          Komplexní finanční poradenství od hypoték přes pojištění až po investice a
          dlouhodobé plánování.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="card">
              <h2 className="mb-3 text-xl font-semibold text-primary">{service.title}</h2>
              <p className="text-muted">{service.text}</p>
            </article>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
