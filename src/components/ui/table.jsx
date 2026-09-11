import { useMemo } from "react";
import { DataTable } from "metricui"; 

const COLORS = [
  "var(--bar_a)", "var(--bar_b)", "var(--bar_c)", "var(--bar_d)", "var(--bar_e)",
  "var(--bar_f)", "var(--bar_g)", "var(--bar_h)", "var(--bar_i)", "var(--bar_j)",
];

function hashToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function formatHour(dateString) {
  if (!dateString) return "-";
  const utcDate = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
  return new Date(utcDate).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateString) {
  if (!dateString) return "-";
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
    { key: "city", header: "City", type: "text" },
    { 
      key: "tags", header: "Tags",
      render: (param) => {
        const row = getRowData(param);
        const text = row.tags || (typeof param === "string" ? param : "");
        const tooltip = row.tags || text;
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
    { key: "ioc_value", header: "IOC", type: "text"},
    {
      key: "malware_printable", header: "Malware",
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
              background: "color-mix(in srgb, var(--success-color,#22c55e) 12%, transparent)",
              color: "var(--success-color,#22c55e)",
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
  ], []);

  return (
    <div className="lg:col-span-8">
      <DataTable
        data={dataTable}
        columns={columns}
        title="Live Threat Feed"
        pageSize={8}
        searchable
        className="card-metricui w-full overflow-hidden"
      />
    </div>
  );
}