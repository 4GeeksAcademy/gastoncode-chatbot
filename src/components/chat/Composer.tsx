type SubmitEventHandler = (event: SubmitEvent) => void | Promise<void>;

type ComposerProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: SubmitEventHandler;
};

export function Composer({ value, isLoading, onChange, onSubmit }: ComposerProps) {
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void onSubmit(e.nativeEvent as SubmitEvent);
      }}
      className="border-t border-slate-800 bg-slate-900/80 p-3 md:p-4"
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Escribe tu mensaje..."
          className="max-h-36 min-h-[48px] flex-1 resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white disabled:opacity-50 hover:bg-blue-500 transition"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}