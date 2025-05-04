export function InfoBox({ title, children, className = "" }) {
  return (
    <div className={`w-full bg-neutral-800 text-white my-4 ${className}`}>
      <div className="p-6 max-w-2xl mx-auto">
        {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
        <div>{children}</div>
      </div>
    </div>
  );
}
