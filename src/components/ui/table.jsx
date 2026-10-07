import { useMemo } from "react";
import { ExternalLink} from "lucide-react"
import { DataTable, MetricProvider } from "metricui"; 

const COLORS = [
  "var(--color_a)",
  "var(--color_b)",
  "var(--color_c)",
  "var(--color_d)",
  "var(--color_e)",
  "var(--color_f)",
  "var(--color_g)",
];

function hashToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function formatHour(dateString) {
  const utcDate = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
  return new Date(utcDate).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateString) {
  const utcDate = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
  return new Date(utcDate).toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function getRowData(param) {
  if (param && typeof param === "object") {
    return param.row?.original ?? param.row ?? param;
  }
  return {};
}

export default function TableUI({ dataTable }) {
  const columns = useMemo(() => [
    { key: "country", header: "Country", type: "text" },
    { key: "ioc", header: "IOC", type: "text"},
    {
      key: "malware", header: "Malware",
      render: (param) => {
        const row = getRowData(param);
        const text = row.malware_printable || row.malware || (typeof param === "string" ? param : "");
        const tooltip = row.malware || text;
        const color = hashToColor(text);

        return (
          <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card,14px)] text-xs font-medium truncate"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              color: color,
            }}
            title={tooltip}
          >
            {text || "-"}
          </span>
        );
      },
    },
    {
      key: "is_compromised",
      header: "Status",
      render: (param) => {
        const row = getRowData(param);
        const isCompromised = Boolean(
          row.is_compromised ?? (typeof param === "boolean" ? param : false)
        );

        return isCompromised ? (
          <span
            className="px-1.5 py-0.5 rounded-[var(--radius-card,14px)] text-xs font-medium"
            style={{
              background: "color-mix(in srgb, var(--danger-color) 12%, transparent)",
              color: "var(--danger-color)",
            }}
          >
            Compromised
          </span>
        ) : (
          <span
            className="px-1.5 py-0.5 rounded-[var(--radius-card,14px)] text-xs font-medium"
            style={{
              background: "color-mix(in srgb, var(--success-color) 12%, transparent)",
              color: "var(--success-color)",
            }}
          >
            Monitoring
          </span>
        );
      },
    },
    {
      key: "first_seen_utc",
      header: "First Seen",
      render: (param) => {
        const row = getRowData(param);
        const dateVal = row.first_seen_utc ?? (typeof param === "string" ? param : null);
        return (
          <div className="flex flex-col leading-tight" title={formatDate(dateVal)}>
            <span className="text-xs">{formatHour(dateVal)}</span>
            <span className="text-[10px] text-[var(--text-secondary)]/70">{formatDate(dateVal)}</span>
          </div>
        );
      },
    },
    { key: "reporter", header: "Reporter", type: "text" },
    { key: "reference",
      header: "Ref",
      render: (param) => {
        const row = getRowData(param);
        const referenceVal = row.reference ?? (typeof param === "string" ? param : null);
        if (!referenceVal){
          return
        }

        return (
          <button
            type="button"
            className="cursor-pointer text-(--text-secondary) hover:text-(--primary-color)"
            onClick={() => window.open(referenceVal)}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        );
      }, 
    },
    { 
      key: "tags", header: "Tags",
      render: (param) => {
        const row = getRowData(param);
        const text = row.tags || (typeof param === "string" ? param : "");
        const tooltip = row.tags || text;
        const color = hashToColor(text);

        return (
          <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              color: color,
            }}
            title={tooltip}
          >
            {text || "-"}
          </span>
        );
      },
    },
  ], []);

  return (
    <MetricProvider exportable>
      <DataTable
        data={dataTable.table}
        columns={columns}
        title={`IOC FEED (${dataTable.table.length})`}
        pageSize={20}
        searchable
        className="card-metricui h-full overflow-hidden"
      />
    </MetricProvider>
  );
}