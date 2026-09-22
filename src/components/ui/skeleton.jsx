import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-[var(--radius-card,14px)] bg-gradient-to-r from-[#e3e8ec] via-[#b0b8c1] to-[#717b85]",
        className
      )}
      {...props} 
    />
  );
}

export { Skeleton }