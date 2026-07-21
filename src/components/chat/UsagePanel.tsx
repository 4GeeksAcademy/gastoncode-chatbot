import { TokenUsage } from "./types";

type UsagePanelProps = {
  usage: TokenUsage | null;
};

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

export function UsagePanel({ usage }: UsagePanelProps) {
  return (
    <section className="border-b border-slate-800 px-4 py-3 md:px-6">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <MetricCard label="Prompt tokens" value={usage?.promptTokens ?? "-"} />
        <MetricCard label="Completion tokens" value={usage?.completionTokens ?? "-"} />
        <MetricCard label="Total tokens" value={usage?.totalTokens ?? "-"} />
      </div>
    </section>
  );
}