import { ExternalLink } from "lucide-react";

export function DataTable({ columns, rows, linkKey }) {
  return (
    <div className="rounded-[var(--radius-card,14px)] border border-(--border-color) bg-(--bg-color)/60 backdrop-blur-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--border-color)">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-2.5 text-xs text-(--text-secondary)"
              >
                {col.label}
              </th>
            ))}
            {linkKey && <th className="w-8" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[linkKey] ?? i}
              className="group border-b border-(--border-color)/50 last:border-0 hover:bg-(--primary-color)/10 hover:backdrop-blur-lg[.25] transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5 text-(--text-color)">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {linkKey && (
                <td className="px-2">
                  <a href={row[linkKey]} target="_blank" rel="noopener noreferrer">
                    <ExternalLink
                      size={13}
                      className="text-(--text-secondary) opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function formatDate(date) {
  return new Date(date).toLocaleString("es-MX", {
    //day: "2-digit",
    //month: "short",
    //year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}