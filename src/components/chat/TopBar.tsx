type TopBarProps = {
  isLoading: boolean;
  onNewChat: () => void;
  modelName: string;
};

export function TopBar({ isLoading, onNewChat, modelName }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:px-6">
      <div>
        <h2 className="text-sm md:text-base font-semibold text-white">Chat principal</h2>
        <p className="text-xs text-slate-400">{isLoading ? "La IA está escribiendo..." : "En línea"}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-300 md:inline">
          Modelo: {modelName}
        </span>
        <button
          onClick={onNewChat}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition md:hidden"
        >
          Nuevo chat
        </button>
      </div>
    </header>
  );
}