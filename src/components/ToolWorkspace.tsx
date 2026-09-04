import { Copy, RotateCcw } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Streamdown } from "streamdown";
import { Disclaimer } from "@/components/AppShell";

export function Card({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-sand-200 bg-cream shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-sand-200 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          {subtitle && <p className="text-xs text-ink-soft">{subtitle}</p>}
        </div>
        {badge}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={
              option === value
                ? "rounded-full bg-amber px-2.5 py-1 text-xs font-medium text-cream"
                : "rounded-full bg-sand-200 px-2.5 py-1 text-xs text-ink-soft transition-colors hover:bg-sand-200/70"
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-sand-200 bg-sand/60 px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-amber/50";

export function GenerateButton({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-sun px-4 py-2.5 text-sm font-semibold text-cream shadow-glow transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
    >
      {loading && (
        <span className="size-3.5 animate-spin rounded-full border-2 border-cream border-t-transparent" />
      )}
      {loading ? loadingLabel : label}
    </button>
  );
}

export function OutputPanel({
  loading,
  error,
  text,
  emptyHint,
  onRegenerate,
}: {
  loading: boolean;
  error: string | null;
  text: string | null;
  emptyHint: string;
  onRegenerate?: (() => void) | undefined;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-3">
      {loading && (
        <div className="rounded-xl border border-sand-200 bg-sand/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber">
            Working…
          </p>
          <div className="mt-3 space-y-2">
            <div className="h-2 rounded-full shimmer" />
            <div className="h-2 w-4/5 rounded-full shimmer" />
            <div className="h-2 w-3/5 rounded-full shimmer" />
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-terra/30 bg-terra/10 p-4 text-sm text-terra">
          {error}
        </div>
      )}

      {!loading && !error && !text && (
        <div className="rounded-xl border border-dashed border-sand-200 bg-sand/40 p-6 text-center text-sm text-ink-soft">
          {emptyHint}
        </div>
      )}

      {!loading && text && (
        <div className="rounded-xl border border-sand-200 bg-sand/60 p-4">
          <div className="prose-headings:font-display max-w-none text-sm leading-relaxed text-ink [&_h2]:mb-1 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_li]:my-0.5 [&_p]:my-2 [&_strong]:font-semibold [&_table]:my-3 [&_table]:w-full [&_table]:text-left [&_td]:border-t [&_td]:border-sand-200 [&_td]:py-1.5 [&_td]:pr-3 [&_th]:pb-1 [&_th]:pr-3 [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-ink-soft [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
            <Streamdown>{text}</Streamdown>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(text);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sand-200 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-sand-200/70"
            >
              <Copy className="size-3.5" /> {copied ? "Copied" : "Copy"}
            </button>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sand-200 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-sand-200/70"
              >
                <RotateCcw className="size-3.5" /> Regenerate
              </button>
            )}
          </div>
        </div>
      )}

      <Disclaimer className="justify-start" />
    </div>
  );
}
