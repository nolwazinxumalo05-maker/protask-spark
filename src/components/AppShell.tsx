import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import mark from "@/assets/solstice-mark.png";

const NAV = [
  { to: "/", label: "Dashboard", glyph: "◷" },
  { to: "/email", label: "Email Generator", glyph: "✉" },
  { to: "/meeting-notes", label: "Meeting Notes", glyph: "▤" },
  { to: "/planner", label: "Task Planner", glyph: "✓" },
  { to: "/research", label: "Research", glyph: "✦" },
  { to: "/chat", label: "AI Chat", glyph: "◍" },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-8 space-y-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-sand-200/60 data-[status=active]:border-l-2 data-[status=active]:border-amber data-[status=active]:bg-gradient-to-r data-[status=active]:from-amber/15 data-[status=active]:to-amber/5 data-[status=active]:font-semibold data-[status=active]:text-ink"
        >
          <span className="text-base">{item.glyph}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-sun shadow-glow">
        <img src={mark} alt="Solstice" width={512} height={512} className="size-6 object-contain" />
      </div>
      <div>
        <p className="font-display text-[15px] font-semibold leading-none">Solstice</p>
        <p className="mt-1 text-[11px] text-ink-soft">Workplace Copilot</p>
      </div>
    </div>
  );
}

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center justify-center gap-1.5 py-2 text-center text-xs text-ink-soft ${className}`}
    >
      <span className="text-amber">✦</span> AI-generated content may require human review
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-sand-200 bg-gradient-dawn">
      <div className="absolute -right-16 -top-24 size-72 rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--amber-soft),transparent_70%)] opacity-50" />
      <div className="relative px-6 py-8 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-ink md:text-[40px]">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">{subtitle}</p>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sand text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-sand-200 bg-cream/70 px-5 py-6 md:flex">
          <Brand />
          <NavList />
          <div className="mt-auto border-t border-sand-200 pt-4">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="grid size-9 place-items-center rounded-full bg-sand-200 text-xs font-semibold text-ink-soft">
                ME
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Ruha Nandakumar</p>
                <p className="truncate text-[11px] text-ink-soft">Pro plan</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-sand-200 bg-cream/70 px-4 py-3 md:hidden">
            <Brand />
            <button
              type="button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-lg border border-sand-200 text-ink-soft"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
          {open && (
            <div className="border-b border-sand-200 bg-cream px-4 pb-4 md:hidden">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
