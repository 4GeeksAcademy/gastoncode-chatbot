type TopBarProps = {
  isLoading: boolean;
  onClearHistory: () => void;
};

export function TopBar({ isLoading, onClearHistory }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:px-6">
      <div>
        <h2 className="text-sm md:text-base font-semibold text-white">Chat principal</h2>
        <p className="text-xs text-slate-400">{isLoading ? "La IA esta respondiendo..." : "En linea"}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClearHistory}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition"
        >
          Limpiar historial
        </button>
      </div>
    </header>
  );
}