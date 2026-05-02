import Link from "next/link";
import { SiteShell } from "../components/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="container-page py-16">
        <h1 className="section-title">O mně</h1>
        <p className="section-lead mb-6">
          Ve financích se pohybuji od roku 2018. Začínal jsem v bankovním sektoru a dnes
          pomáhám klientům napříč celou Českou republikou díky kombinaci osobního přístupu a
          moderních technologií.
        </p>
        <div className="card">
          <p className="mb-4 text-muted">
            Mým cílem je, aby finanční rozhodnutí byla srozumitelná, bezpečná a dlouhodobě
            přínosná. Ke každému klientovi přistupuji individuálně a hledám řešení, která
            dávají smysl v jeho životní situaci.
          </p>
          <p className="text-muted">
            Společně nastavíme plán, který vás povede k osobním i rodinným cílům, a budu vám
            partnerem i při průběžných změnách.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/kontakt" className="btn-primary">
            Domluvit schůzku
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
