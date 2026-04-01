import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  MapPinned,
  ShieldCheck,
  Building2,
  Clock3,
  BarChart3,
} from "lucide-react";

function ActionCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="text-xl font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
        {cta}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-800">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <Building2 className="h-4 w-4" />
              Platformă digitală pentru primării
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Cereri cetățenești, tracking, dashboard și hartă operațională
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              O aplicație modernă pentru gestionarea sesizărilor și cererilor
              cetățenești: depunere online, urmărire status, administrare internă,
              analitice și localizare pe hartă.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cetatean/trimite"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
              >
                Depune cerere
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/cetatean/tracking"
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-3 text-slate-900"
              >
                Verifică status
              </Link>

              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-3 text-slate-900"
              >
                Acces administrație
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <ActionCard
            title="Depune o cerere"
            description="Trimite rapid o sesizare sau o cerere către primărie, cu localizare pe hartă și date complete."
            href="/cetatean/trimite"
            cta="Deschide formularul"
          />

          <ActionCard
            title="Verifică statusul"
            description="Introdu codul cererii și emailul folosit la trimitere pentru a vedea statusul și istoricul actualizărilor."
            href="/cetatean/tracking"
            cta="Vezi tracking"
          />

          <ActionCard
            title="Panou administrație"
            description="Operatorii primăriei pot administra cereri, actualiza statusuri, comenta cazuri și urmări indicatorii."
            href="/admin/login"
            cta="Intră în admin"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Funcționalități principale
          </h2>
          <p className="mt-3 text-slate-600">
            Platforma este construită pentru fluxuri reale de lucru dintre cetățeni
            și administrație.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Formular digital"
            description="Depunere rapidă de cereri și sesizări, cu validare, cod unic și localizare pe hartă."
          />

          <FeatureCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Tracking public"
            description="Cetățeanul poate urmări statusul cererii și istoricul public al actualizărilor."
          />

          <FeatureCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Dashboard operațional"
            description="Indicatori reali din baza de date: totaluri, statusuri, categorii și trend pe ultimele zile."
          />

          <FeatureCard
            icon={<MapPinned className="h-5 w-5" />}
            title="Hartă operațională"
            description="Vizualizare geografică a problemelor raportate și acces rapid la detaliul fiecărei cereri."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Gândită pentru transparență și operare rapidă
              </h2>
              <p className="mt-4 max-w-3xl text-slate-600">
                Aplicația separă clar zona publică de cea internă și permite
                administrarea completă a cererilor: filtrare, actualizare status,
                comentarii publice și interne, dashboard și hartă.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-slate-700" />
                <div>
                  <div className="font-medium">Separare cetățean / admin</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Acces public pentru depunere și tracking, acces intern protejat
                    pentru operatori și administratori.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}