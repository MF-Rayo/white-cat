import { Skeleton } from "@/components/ui/skeleton"

export function CardImage({title, summary, frontPage, date, url, source}) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric"
  })

  return (
    <div onClick={() => window.open(url, "_blank")}
      className="group relative flex flex-col overflow-hidden bg-(--bg-color)/80 backdrop-blur-xl rounded-[var(--radius-card,14px)] 
      cursor-pointer transition-all duration-300 hover:scale-[1.02]"
    >

      <div className="relative overflow-hidden" style={{ height: "180px" }}>
        <img
          src={frontPage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "brightness(0.8) saturate(0.8)" }}
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-card,14px)] bg-(--bg-color)">
          <span className="w-1.5 h-1.5 rounded-full bg-(--primary-color) animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-(--primary-color)">
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

        <p className="text-xs leading-relaxed line-clamp-3 text-(--text-secondary)">
          {summary}
        </p>

        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 text-(--text-secondary)">
            Go to the original source of the information
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase 
            transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0
            text-(--primary-color)">
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
    <div className="h-full rounded-[var(--radius-card,14px)] overflow-hidden border border-(--text-color)/10 bg-(--bg-color)">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
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