import { useMemo,Suspense } from "react";
import { ErrorBoundary } from "@/hooks/ErrorBoundary"
import { DataTable, useMetricFilters, FilterProvider, FilterBar, 
  DropdownFilter, MetricProvider, BarChart } from "metricui";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import Container from "@/components/Container"
import { hashToColorSeverity }  from "@/lib/hashColor"
import { formatDate, formatHour } from "@/lib/formatDate";

const cveDate   = fetchData(endpoints.cveReportedDate)
const cve_cvss3 = fetchData(endpoints.cve_cvss3_1)
const cve_cvss4 = fetchData(endpoints.cve_cvss4_0)

function DataDetails({ data }){
  return(
    <div className="grid grid-cols-1 gap-4 p-2 text-xs md:grid-cols-3">
      {data.description && (
      <div className="space-y-2 md:col-span-2 text-(--text-secondary)">
        <p><strong className="text-(--text-color)" >Description: </strong>{data.description}</p>
      </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-(--gp)" >
        {data.cvss31_raw && (
        <div className="space-y-2 text-(--text-secondary)">
          <p><strong className="text-(--text-color)" >cvss Metric V3.1</strong></p>
          <p><strong className="text-(--text-color)" >Scope: </strong>{data.cvss31_raw.scope}</p>
          <p><strong className="text-(--text-color)" >Version: </strong>{data.cvss31_raw.version}</p>
          <p><strong className="text-(--text-color)" >Base Score: </strong>{data.cvss31_raw.baseScore}</p>
          <p><strong className="text-(--text-color)" >Attack Vector: </strong>{data.cvss31_raw.attackVector}</p>
          <p><strong className="text-(--text-color)" >Base Severity: </strong>{data.cvss31_raw.baseSeverity}</p>
          <p><strong className="text-(--text-color)" >Vector String: </strong>{data.cvss31_raw.vectorString}</p>
          <p><strong className="text-(--text-color)" >Integrity Impact: </strong>{data.cvss31_raw.integrityImpact}</p>
          <p><strong className="text-(--text-color)" >User Interaction: </strong>{data.cvss31_raw.userInteraction}</p>
          <p><strong className="text-(--text-color)" >Attack Complexity: </strong>{data.cvss31_raw.attackComplexity}</p>
          <p><strong className="text-(--text-color)" >Availability Impact: </strong>{data.cvss31_raw.availabilityImpact}</p>
          <p><strong className="text-(--text-color)" >Privileges Required: </strong>{data.cvss31_raw.privilegesRequired}</p>
          <p><strong className="text-(--text-color)" >Confidentiality Impact: </strong>{data.cvss31_raw.confidentialityImpact}</p>
        </div>
        )}
        {data.cvss40_raw && (
        <div className="space-y-2 text-(--text-secondary)">
          <p><strong className="text-(--text-color)">cvss Metric V4.0</strong></p>
          <p><strong className="text-(--text-color)">Safety: </strong>{data.cvss40_raw.Safety}</p>
          <p><strong className="text-(--text-color)">Version: </strong>{data.cvss40_raw.version}</p>
          <p><strong className="text-(--text-color)">Base Score: </strong>{data.cvss40_raw.baseScore}</p>
          <p><strong className="text-(--text-color)">Base Severity: </strong>{data.cvss40_raw.baseSeverity}</p>
          <p><strong className="text-(--text-color)">Automatable: </strong>{data.cvss40_raw.Automatable}</p>
          <p><strong className="text-(--text-color)">Attack Vector: </strong>{data.cvss40_raw.attackVector}</p>
          <p><strong className="text-(--text-color)">Vector String: </strong>{data.cvss40_raw.vectorString}</p>
          <p><strong className="text-(--text-color)">Exploit Maturity: </strong>{data.cvss40_raw.exploitMaturity}</p>
          <p><strong className="text-(--text-color)">Attack Complexity: </strong>{data.cvss40_raw.attackComplexity}</p>
          <p><strong className="text-(--text-color)">Privileges Required: </strong>{data.cvss40_raw.privilegesRequired}</p>
          <p><strong className="text-(--text-color)">User Interaction: </strong>{data.cvss40_raw.userInteraction}</p>
          <p><strong className="text-(--text-color)">Confidentiality Impact: </strong>{data.cvss40_raw.vulnConfidentialityImpact}</p>
          <p><strong className="text-(--text-color)">Integrity Impact: </strong>{data.cvss40_raw.vulnIntegrityImpact}</p>
          <p><strong className="text-(--text-color)">Availability Impact: </strong>{data.cvss40_raw.vulnAvailabilityImpact}</p> 
        </div>
        )}
        <div className="space-y-2 text-(--text-secondary)">
          {data.reference && (
          <div>
            <strong className="text-(--text-color)">References: </strong>
            <ul className="list-disc pl-5 mt-1">
              {data.reference.map((ref, index) => (
                <li key={index}>
                  <a 
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-(--primary-color) break-all"
                  >
                    {ref.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}


function CveTable({ apiData }){

  const data = apiData.read();
  const date = cveDate.read();
  const cvss3 = cve_cvss3.read();
  const cvss4 = cve_cvss4.read();

  const columns = useMemo(() => [
    { key: "cve_id", header: "CVE", type: "text"},
    { key: "cvss31_base_score", header: "CVSS v3.1", type: "text"},
    { key: "cvss31_severity", header: "Severity",
      render: (cvss31_severity) => {
        const color = hashToColorSeverity(cvss31_severity);

        return (
          <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              color: color,
            }}
            title={cvss31_severity}
          >
            {cvss31_severity || "—"}
          </span>
        );
      }
    },
    { key: "cvss31_attack_complexity", header: "Attack Complexity",
      render: (cvss31_attack_complexity) => {
        const color = hashToColorSeverity(cvss31_attack_complexity);

        return (
          <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              color: color,
            }}
            title={cvss31_attack_complexity}
          >
            {cvss31_attack_complexity || "—"}
          </span>
        );
      }
    },
    { key: "cvss40_base_score", header: "CVSS v4.0", type: "text"},
    { key: "cvss40_severity", header: "Severity",
      render: (cvss40_severity) => {
        const color = hashToColorSeverity(cvss40_severity);

        return (
          <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              color: color,
            }}
            title={cvss40_severity}
          >
            {cvss40_severity || "—"}
          </span>
        );
      }
    },
    { key: "cvss40_attack_complexity", header: "Attack Complexity",
      render: (cvss40_attack_complexity) => {
        const color = hashToColorSeverity(cvss40_attack_complexity);

        return (
          <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              color: color,
            }}
            title={cvss40_attack_complexity}
          >
            {cvss40_attack_complexity || "—"}
          </span>
        );
      }
    },
    {
      key: "published",
      header: "Published",
      render: (cvssData) => {
        const dateVal = typeof cvssData === "string" ? cvssData : null;
        return (
          <div className="flex flex-col leading-tight" title={formatDate(dateVal)}>
            <span className="text-xs">{formatHour(dateVal)}</span>
            <span className="text-[10px] text-[var(--text-secondary)]/70">{formatDate(dateVal)}</span>
          </div>
        );
      },
    },
  ], []);

  return(
    <div>
      <FilterBar className="card-metricui">
        <DropdownFilter
          label="Severity CVSS 3.1"
          allLabel="All CVSS 3.1"
          options={cvss3}
          field="cvss3"
          showAll
        />
        <DropdownFilter
          label="Severity CVSS 4.0"
          allLabel="All CVSS 4.0"
          options={cvss4}
          field="cvss4"
          showAll
        />
        <DropdownFilter
          label="Today's CVE"
          allLabel="Today's CVE"
          options={date}
          field="date"
          showAll
        />
      </FilterBar>

      <div className="pt-(--pd)">
        <DataTable
        data={data}
        columns={columns}
        title="Reported CVEs"
        searchable
        pageSize={10}
        className="card-metricui"
        renderExpanded={(row) => <DataDetails data={row} />}
      />
      </div>
    </div>
  )
}


function CveBody() {
  const filters = useMetricFilters();

  const selectedDate = filters?.dimensions?.date || "all";
  const selectedCVSS3 = filters?.dimensions?.cvss3 || "all";
  const selectedCVSS4 = filters?.dimensions?.cvss4 || "all";

  const params = new URLSearchParams();
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedCVSS3 !== "all") params.set("cvss3", selectedCVSS3);
  if (selectedCVSS4 !== "all") params.set("cvss4", selectedCVSS4);

  const cveURL = params.toString()
    ? `${endpoints.cveReported}?${params}`
    : endpoints.cveReported;

  const apiData = fetchData(cveURL);

  return (
    <Container path="~/CVE Reported">
      <ErrorBoundary resetKey={cveURL}>
        <Suspense fallback={
          <>
            <FilterBar className="card-metricui">
              <p className="text-(--text-color)">Loading...</p>
            </FilterBar>
            <div className="pt-(--pd)">
              <BarChart data={[]} loading className="card-metricui h-full"/>
            </div>
          </>
        }>
          <MetricProvider exportable>
            <CveTable apiData={apiData}/>
          </MetricProvider>
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
}

export default function cvePage () {
    return (
      <FilterProvider>
        <CveBody/>
      </FilterProvider>
    )
}