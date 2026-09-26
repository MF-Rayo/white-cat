import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-[var(--radius-card)] bg-(--border-color)",
        className
      )}
      {...props} 
    />
  );
}

export { Skeleton }