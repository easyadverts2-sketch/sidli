import { SiteShell } from "../components/site-shell";
import { testimonials } from "../lib/content";

export default function ReferencesPage() {
  return (
    <SiteShell>
      <main className="container-page py-16">
        <h1 className="section-title">Reference klientů</h1>
        <p className="section-lead mb-8">
          Dlouhodobá spolupráce, srozumitelné vysvětlení a řešení, která klientům šetří čas i
          peníze.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((reference) => (
            <article key={reference.name} className="card">
              <p className="mb-3 text-muted">&quot;{reference.quote}&quot;</p>
              <p className="font-semibold text-primary">{reference.name}</p>
            </article>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
