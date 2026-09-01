import { Skeleton } from "@/components/ui/skeleton"

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-(--bg-color)/60 backdrop-blur-xl rounded-md px-3 py-2 shadow-xl">
      <p className="font-mono text-[10px] text-[#8592A3] mb-1 uppercase tracking-wide">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-mono text-[11px]" style={{ color: p.color || p.fill }}>
          {p.name}: <span className="text-[#E7EDF4]">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function Panel({ title, right, children, className = "" }) {
  return (
    <div className={`bg-(--bg-color)/60 backdrop-blur-xl flex flex-col rounded-[var(--radius-card,14px)] ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-hover)">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.14em] text-[#8592A3] uppercase">
            {title}
          </span>
        </div>
        {right}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export function PanelSkeleton({className  = "" }) {
  return (
    <div className={`rounded-[var(--radius-card,14px)] ${className}`}>
      <Skeleton className="h-full w-full" />
    </div>
  );
}