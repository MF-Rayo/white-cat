import { Badge } from "metricui";
import { Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function Card({
  source,
  activity,
  post_url,
  discovered,
  group_name,
  victim,
  description,
}) {

  return (
    <div
      onClick={() => post_url && window.open(post_url, "_blank")}
      className="group relative flex flex-col justify-between overflow-hidden bg-(--bg-color) rounded-[var(--radius-card)] 
        border border-(--border-color) cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-neutral-700 p-4 gap-3"
    >
      
      <div className="flex items-center justify-between gap-2">
        <Badge variant="success" dot>
          {source}
        </Badge>

        <Badge variant="danger" icon={<Users className="h-3 w-3" />}>
          Group: {group_name}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-bold text-sm leading-snug line-clamp-1 transition-colors duration-200 font-mono tracking-wide"
            style={{ color: "var(--primary-color)" }}
          >
            {victim}
          </h3>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800/60 px-1.5 py-0.5 rounded border border-neutral-700/40 shrink-0">
            {activity}
          </span>
        </div>

        {description && (
          <p className="text-xs leading-relaxed line-clamp-2 text-(--text-secondary) mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/40 mt-auto">
        <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 text-(--text-secondary)">
          View Original Source
        </span>
      </div>
    </div>
  );
}