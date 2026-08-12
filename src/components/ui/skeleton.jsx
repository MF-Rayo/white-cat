import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-muted/60 dark:bg-(--bg-color)", className)}
      {...props} 
    />
  );
}

export { Skeleton }