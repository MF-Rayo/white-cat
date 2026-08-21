import { Skeleton } from "@/components/ui/skeleton"

export function CardImage({title, summary, frontPage, date, url, source}) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric"
  })

  return (
    <div
      onClick={() => window.open(url, "_blank")}
      className="group relative flex flex-col overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >

      <div className="relative overflow-hidden" style={{ height: "180px" }}>
        <img
          src={frontPage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "brightness(0.8) saturate(0.8)" }}
        />

        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-(--primary-color) animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-(--primary-color)"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            {source}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">

        <div className="flex items-center gap-2">
          <span className="text-(--primary-color) text-[10px] font-mono opacity-60">//</span>
          <span className="text-[10px] font-mono tracking-wider opacity-50"
            style={{ color: "var(--text-secondary)" }}>
            {formattedDate}
          </span>
        </div>

        <h3
          className="font-bold text-sm leading-snug line-clamp-2 transition-colors duration-200"
          style={{ color: "var(--primary-color)", fontFamily: "Poppins, sans-serif" }}
        >
          {title}
        </h3>

        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{ color: "var(--text-secondary)", fontFamily: "Poppins, sans-serif" }}
        >
          {summary}
        </p>

        <div className="flex items-center justify-between pt-1 mt-auto">
          <span
            className="text-[10px] font-mono tracking-widest uppercase opacity-40"
            style={{ color: "var(--text-secondary)" }}
          >
            read_more
          </span>
          <div
            className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            style={{ color: "var(--primary-color)", fontFamily: "Poppins, sans-serif" }}
          >
            <span>→</span>
          </div>
        </div>
      </div>

      {/* línea glow inferior al hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(90deg, transparent, var(--primary-color), transparent)" }}
      />

      {/* borde izquierdo al hover */}
      <div
        className="absolute top-0 left-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(180deg, transparent, var(--primary-color), transparent)" }}
      />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-(--text-color)/10">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function NoResults(){
  return(
    <div className="h-screen col-span-full flex flex-col items-center justify-center text-(--text-color)/40">
      <span className="text-5xl mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
        </svg>
      </span>
      <span className="font-poppins text-lg">No results found</span>
      <span className="text-sm mt-1">Try adjusting your filters</span>
    </div>
  )
}


export function KpiCard({ label, value, delta, deltaTone = "up", icon: Icon, accent }) {
  return (
    <div className="bg-(--bg-color)/60 backdrop-blur-xl rounded-[var(--radius-card,14px)]  p-4 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full w-3px"
      />
      <div className="flex items-start justify-between pl-2">
        <div>
          <p className="text-[10px] tracking-[0.14em] text-(--text-secondary) uppercase mb-2">
            {label}
          </p>
          <p className="text-[28px] leading-none text-(--text-color) font-semibold">
            {value}
          </p>
        </div>
        <Icon size={18} style={{ color: accent }} strokeWidth={2} />
      </div>
      {delta && (
        <p className="pl-2 mt-3 text-[11px]" style={{ color: deltaTone === "up" ? "var(--danger-color)" : "var(--success-color)" }}>
          {deltaTone === "up" ? "▲" : "▼"} {delta}
        </p>
      )}
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-(--bg-color)/60 backdrop-blur-xl rounded-lg p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-3px bg-(--text-secondary)/20" />
          <div className="flex items-start justify-between pl-2">
            <div className="flex-1">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          <div className="pl-2 mt-3">
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}