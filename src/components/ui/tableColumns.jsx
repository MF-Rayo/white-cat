import { formatDate } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"

export function truncateText(text, limit = 10) {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

export function groupsColumns() {
  return [
    {
      key: "group_name",
      label: "Active Groups",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--danger-color) opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-(--danger-color)" />
          </span>
          <span>{row.group_name}</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Total",
      render: (row) => (
        <span className="text-xs text-(--text-secondary)/70">{row.count}</span>
      ),
    },
  ];
}

export function Columns({ label, fieldKey  } = {}) {
  return [
    {
      key: fieldKey,
      label: label,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--warning-color) opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-(--warning-color)" />
          </span>
          <span>{row[fieldKey]}</span>
        </div>
      ),
    },
    {
      key: "count",
      label: "Total",
      render: (row) => (
        <span className="text-xs text-(--text-secondary)/70">
          {row.count}
        </span>
      ),
    },
  ];
}
export function RowSkeleton() {
  return (
    <div className="bg-(--bg-color)/60 backdrop-blur-xl rounded-[var(--radius-card,14px)] flex flex-col gap-3">
  
      <div className="flex items-center justify-between p-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>

      <div className="flex flex-col gap-1 p-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full shrink-0" />
              <Skeleton className="h-4 w-24 sm:w-32" />
            </div>
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}