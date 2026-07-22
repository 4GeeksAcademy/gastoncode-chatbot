import { TokenUsage } from "./types";

type UsagePanelProps = {
  usage: TokenUsage | null;
  sessionUsage: TokenUsage;
  responseTimeMs: number | null;
  modelName: string;
};

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="min-h-[68px] rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function UsageRow({ title, data }: { title: string; data: TokenUsage | null }) {
  return (
    <div>
      <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">{title}</p>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <MetricCard label="Prompt tokens" value={data?.promptTokens ?? "-"} />
        <MetricCard label="Completion tokens" value={data?.completionTokens ?? "-"} />
        <MetricCard label="Total tokens" value={data?.totalTokens ?? "-"} />
      </div>
    </div>
  );
}

export function UsagePanel({ usage, sessionUsage, responseTimeMs, modelName }: UsagePanelProps) {
  return (
    <section className="shrink-0 max-h-[33vh] overflow-y-auto border-b border-slate-800 px-4 py-2 md:px-6 space-y-2">
      <UsageRow title="Última respuesta" data={usage} />
      <UsageRow title="Acumulado sesión" data={sessionUsage} />
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Métrica adicional</p>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <MetricCard label="Tiempo de respuesta (ms)" value={responseTimeMs ?? "-"} />
          <MetricCard label="Modelo usado" value={modelName || "-"} />
        </div>
      </div>
    </section>
  );
}