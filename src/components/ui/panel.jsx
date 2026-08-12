import { Skeleton } from "@/components/ui/skeleton"

export function Panel({ title, icon: Icon, right, children, className = "" }) {
  return (
    <div className={`bg-(--bg-color)/60 backdrop-blur-xl flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-hover)">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-(--primary-color)" strokeWidth={2.25} />}
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


export function PanelSkeleton() {
  return (
    <div className="pt-4 grid grid-cols-5 gap-4 min-h-[300px]">
      <Panel title="Today's Top 10 IOC Origins" className="xl:col-span-3 rounded-lg">
        <div className="min-h-[300px] h-full w-full overflow-hidden">
          <div className="flex flex-col gap-4 h-full justify-center">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-[110px] flex-shrink-0" />
                <Skeleton className="h-4 flex-1" style={{ width: `${Math.random() * 80 + 20}%` }} />
              </div>
            ))}
          </div>
        </div>
      </Panel>
      <div className="col-span-2 bg-(--bg-color)/60 backdrop-blur-xl rounded-lg h-full overflow-hidden">
          <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}