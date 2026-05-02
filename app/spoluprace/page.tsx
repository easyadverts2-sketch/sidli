import Link from "next/link";
import { SiteShell } from "../components/site-shell";

export default function CooperationPage() {
  return (
    <SiteShell>
      <main className="container-page py-16">
        <h1 className="section-title">Spolupráce</h1>
        <p className="section-lead mb-8">
          Pokud zvažujete kariéru ve financích nebo hledáte zkušeného partnera pro rozvoj
          vlastního podnikání, rád vás podpořím.
        </p>
        <div className="card">
          <p className="mb-4 text-muted">
            Předám vám zkušenosti z bankovního sektoru i finančního poradenství. Pomohu vám s
            prvními kroky, prací s klienty i budováním stabilní kariéry založené na férovosti
            a dlouhodobém přístupu.
          </p>
          <p className="text-muted">
            Ať už ve financích začínáte, nebo se chcete posunout dál, společně nastavíme jasný
            plán spolupráce.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/kontakt" className="btn-primary">
            Mám zájem o spolupráci
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
