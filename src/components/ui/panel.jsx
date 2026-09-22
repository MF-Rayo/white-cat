import { Skeleton } from "@/components/ui/skeleton"

export function Panel({ title, right, children, className = "" }) {
  return (
    <div className={`bg-(--bg-color)/60 backdrop-blur-xl flex flex-col 
      rounded-[var(--radius-card,14px)] border border-[var(--border-color)] ${className}`}>
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