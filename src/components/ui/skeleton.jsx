import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-[var(--radius-card,14px)] bg-(--border-hover)/60", className)}
      {...props} 
    />
  );
}

export { Skeleton }