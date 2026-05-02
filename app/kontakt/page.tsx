import { SiteShell } from "../components/site-shell";

export default function ContactPage() {
  return (
    <SiteShell>
      <main className="container-page py-16">
        <h1 className="section-title">Kontakt</h1>
        <p className="section-lead mb-8">
          Ozvěte se a domluvíme nezávaznou úvodní konzultaci podle vašich potřeb.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold text-primary">Kontaktní údaje</h2>
            <p className="mb-2">
              <strong>Telefon:</strong> +420 777 123 456
            </p>
            <p className="mb-2">
              <strong>E-mail:</strong> info@finance-sidlichovsky.cz
            </p>
            <p>
              <strong>Pobočka:</strong> Praha 4, Česká republika
            </p>
          </div>

          <form className="card">
            <h2 className="mb-4 text-xl font-semibold text-primary">Kontaktní formulář</h2>
            <div className="mb-3">
              <label className="mb-1 block text-sm text-muted">Jméno a příjmení</label>
              <input
                className="form-field rounded-lg px-3 py-2"
                placeholder="Vaše jméno"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm text-muted">E-mail</label>
              <input
                className="form-field rounded-lg px-3 py-2"
                placeholder="vas@email.cz"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm text-muted">Telefon</label>
              <input
                className="form-field rounded-lg px-3 py-2"
                placeholder="+420"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-sm text-muted">Text zprávy</label>
              <textarea
                className="form-field min-h-28 w-full rounded-lg px-3 py-2"
                placeholder="Napište, s čím vám mohu pomoci..."
              />
            </div>
            <button type="button" className="btn-primary">
              Odeslat
            </button>
          </form>
        </div>
      </main>
    </SiteShell>
  );
}
