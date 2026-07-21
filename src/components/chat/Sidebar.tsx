type SidebarProps = {
  onNewChat: () => void;
  onUsePrompt: (prompt: string) => void;
};

const quickPrompts = [
  "Ayúdame a crear un landing con Next.js",
  "Explícame este error de TypeScript",
  "Dame un plan de estudio de React de 30 días",
];

export function Sidebar({ onNewChat, onUsePrompt }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col border-r border-slate-800 bg-slate-950/80">
      <div className="p-5 border-b border-slate-800">
        <h1 className="text-lg font-semibold text-white">GastonCode Chat</h1>
        <p className="text-xs text-slate-400 mt-1">AI Assistant</p>
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
    </aside>
  );
}