import { SiteShell } from "../components/site-shell";

const steps = [
  {
    title: "Úvodní schůzka",
    text: "Společně probereme vaše cíle, očekávání a základní parametry dlouhodobé spolupráce.",
  },
  {
    title: "Finanční plán",
    text: "Na základě analýzy připravím návrh řešení a doporučím konkrétní postup.",
  },
  {
    title: "Realizace",
    text: "Po odsouhlasení plánu zajistím realizaci vybraných produktů a nastavení.",
  },
  {
    title: "Pravidelný servis",
    text: "Průběžně aktualizujeme plán podle vašich životních změn i vývoje trhu.",
  },
];

export default function ProcessPage() {
  return (
    <SiteShell>
      <main className="container-page py-16">
        <h1 className="section-title">Proces spolupráce</h1>
        <p className="section-lead mb-8">
          Na spolupráci stavím transparentně a krok za krokem. Každá fáze má jasný cíl a
          navazuje na vaše skutečné potřeby.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <article key={step.title} className="card">
              <p className="mb-2 text-sm font-semibold text-accent">Krok {index + 1}</p>
              <h2 className="mb-2 text-xl font-semibold text-primary">{step.title}</h2>
              <p className="text-muted">{step.text}</p>
            </article>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
