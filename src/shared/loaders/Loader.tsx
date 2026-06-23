interface LoaderProps {
  label?: string;
}

export function Loader({ label }: LoaderProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-border border-t-accent" />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
}
