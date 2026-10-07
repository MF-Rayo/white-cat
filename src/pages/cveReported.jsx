import { useMemo, useState } from "react";
import Container from "@/components/Container"

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import { DonutChart, DataTable, Radar } from "metricui";

import { buildStats } from "@/lib/cve";

const cveResource = fetchData(endpoints.cveReported);
 
function CveDetails({ cve }) {
  if (!cve) return null;
 
  return (
    <div className="grid grid-cols-1 gap-4 p-2 text-sm md:grid-cols-3">
    
      <div className="space-y-2 md:col-span-2 text-(--text-secondary)">
        <p className="font-semibold" style={{ color: cve.color }}>
          {cve.severityName} · CVSS {cve.score ?? "N/A"} {cve.version && `(v${cve.version})`}
        </p>
 
        {cve.inKev && (
          <p style={{ color: "var(--danger-color)" }}>
            Actively exploited (CISA KEV) · fix due {cve.kevDueDate}
          </p>
        )}
 
        <p>{cve.description}</p>
        <p><strong>Vector:</strong> <code>{cve.vector ?? "—"}</code></p>
        <p><strong>CWE:</strong> {cve.cwes.join(", ") || "—"}</p>
      </div>
 
      <div className="space-y-2 text-(--text-secondary)">
        <p><strong>Exploitability:</strong> {cve.exploitability} · <strong>Impact:</strong> {cve.impact}</p>
        <p><strong>Status:</strong> {cve.status}</p>
        <p><strong>Published:</strong> {cve.publishedText}</p>
 
        <p><strong>References ({cve.references.length}):</strong></p>
        <ul className="space-y-1">
          {cve.references.slice(0, 5).map((ref) => (
            <li key={ref.url} className="truncate">
              <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }}>
                {ref.url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
 
function CveBody() {
  const raw = cveResource.read();
  const s = useMemo(() => buildStats(raw), [raw]);
 
  return (
    <div className="grid grid-cols-1 gap-(--gp) lg:grid-cols-6">
        <div className="grid grid-cols-1 gap-(--gp) lg:col-span-4">
            <DataTable
                data={s.rows}
                title="Reported CVEs"
                searchable
                pageSize={15}
                className="card-metricui"
                renderExpanded={(row) => <CveDetails cve={s.byId[row.cve]} />}
            />
        </div>
        <div className="grid grid-cols-1 gap-(--gp) lg:col-span-2">
            <DonutChart
            data={s.donut}
            centerValue={s.centerValue}
            centerLabel="Critical + High"
            title="Threat Level"
            enableArcLabels
            enableArcLinkLabels
            className="card-metricui"
            />
    
            <Radar
            data={s.topCwe}
            index="cwe"
            categories={["total"]}
            title="Top CWE"
            height={300}
            className="card-metricui"
            />
        </div>
    </div>
  );
}
 



export default function cvePage () {
    return (
        <Container path="~/CVE Reported">
            <CveBody/>
        </Container>
    )
}