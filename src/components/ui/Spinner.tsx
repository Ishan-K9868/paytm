export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="spinner-wrap" aria-label={label} role="status">
      <span className="spinner" />
    </div>
  );
}
