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

export function newsColumns() {
  return [
    { key: "title", label: "News",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--success-color) opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-(--success-color)" />
          </span>
          <span>{truncateText(row.title, 12)}</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span className="text-xs text-(--text-secondary)/70">
          {formatDate(row.date)}
        </span>
      ),
    },
  ];
}

export function attacksColumns() {
  return [
    { key: "top_threats", label: "Threat",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--warning-color) opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-(--warning-color)" />
          </span>
          <span>{row.threat_type}</span>
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

export function iocColumns() {
  return [
    {
      key: "ioc_value",
      label: "IOC",
      render: (row) => (
        <span className="font-mono text-(--primary-color)" title={row.ioc_value}>
          {truncateText(row.ioc_value, 24)}
        </span>
      ),
    },
    {
      key: "malware_printable",
      label: "Threat",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--primary-color) opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-(--primary-color)" />
          </span>
          <span>{row.malware_printable || row.malware || "Unknown"}</span>
        </div>
      ),
    },
    {
      key: "country",
      label: "Country",
      render: (row) => (
        <span className="text-(--text-secondary)">
          {row.country ?? "—"}{row.city ? `, ${row.city}` : ""}
        </span>
      ),
    },
    {
      key: "confidence_level",
      label: "Confidence",
      render: (row) => (
        <span className="font-mono font-semibold text-(--primary-color)">
          {row.confidence_level != null ? `${row.confidence_level}%` : "—"}
        </span>
      ),
    },
    {
      key: "first_seen_utc",
      label: "First Seen",
      render: (row) => (
        <span className="text-xs text-(--text-secondary)/70">
          {row.first_seen_utc ? formatDate(row.first_seen_utc) : "—"}
        </span>
      ),
    },
  ];
}


export function RowSkeleton() {
  return (
    <div className="bg-(--bg-color)/60 backdrop-blur-xl rounded-lg flex flex-col gap-3">
  
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>

      <div className="flex flex-col gap-1">
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