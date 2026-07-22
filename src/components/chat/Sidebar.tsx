import { TokenUsage } from "./types";
import { UsagePanel } from "./UsagePanel";

type SidebarProps = {
  onNewChat: () => void;
  onUsePrompt: (prompt: string) => void;
  usage: TokenUsage | null;
  sessionUsage: TokenUsage;
  responseTimeMs: number | null;
  modelName: string;
};

const quickPrompts = [
  "¿Cuáles son los horarios de los turnos del liceo?",
  "¿Cómo justifico una inasistencia?",
  "¿Cuánto cuesta la cuota mensual?",
];

export function Sidebar({ onNewChat, onUsePrompt, usage, sessionUsage, responseTimeMs, modelName }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:w-80 md:flex-col overflow-y-auto border-r border-slate-800 bg-slate-950/80">
      <div className="p-5 border-b border-slate-800">
        <h1 className="text-lg font-semibold text-white">Liceo Horizonte Sur</h1>
        <p className="text-xs text-slate-400 mt-1">Asistente institucional</p>
      </div>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition"
        >
          + Nuevo chat
        </button>
      </div>

      <div className="px-4 pb-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Sugerencias</p>
        <div className="space-y-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onUsePrompt(prompt)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <UsagePanel
          usage={usage}
          sessionUsage={sessionUsage}
          responseTimeMs={responseTimeMs}
          modelName={modelName}
        />
      </div>
    </aside>
  );
}