import { useMemo,Suspense } from "react";
import { ErrorBoundary } from "@/hooks/ErrorBoundary"

import { DataTable, useMetricFilters, FilterProvider, FilterBar, 
  DropdownFilter, MetricProvider, BarChart } from "metricui";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { hashToColorSeverity }  from "@/lib/hashColor"

import Container from "@/components/Container"
import { CustomBadge } from "@/components/ui/badge/Badge";
import { DataDetails } from "@/components/ui/details/cvss"
import {FormatDate} from "@/components/ui/date/FormatDate"

const cveDate   = fetchData(endpoints.cveReportedDate)
const cve_cvss3 = fetchData(endpoints.cve_cvss3_1)
const cve_cvss4 = fetchData(endpoints.cve_cvss4_0)

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
        return (<CustomBadge color={color} title={cvss31_severity}/>);
      }
    },
    { key: "cvss31_attack_complexity", header: "Attack Complexity",
      render: (cvss31_attack_complexity) => {
        const color = hashToColorSeverity(cvss31_attack_complexity);
        return (<CustomBadge color={color} title={cvss31_attack_complexity}/>);
      }
    },
    { key: "cvss40_base_score", header: "CVSS v4.0", type: "text"},
    { key: "cvss40_severity", header: "Severity",
      render: (cvss40_severity) => {
        const color = hashToColorSeverity(cvss40_severity);
        return (<CustomBadge color={color} title={cvss40_severity}/>);
      }
    },
    { key: "cvss40_attack_complexity", header: "Attack Complexity",
      render: (cvss40_attack_complexity) => {
        const color = hashToColorSeverity(cvss40_attack_complexity);
        return (<CustomBadge color={color} title={cvss40_attack_complexity}/>);
      }
    },
    {
      key: "published",
      header: "Published UTC/LOCAL",
      render: (cvssData) => {
        const dateVal = typeof cvssData === "string" ? cvssData : null;
        return (<FormatDate date={dateVal}/>);
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
    <Container path="~/Reported CVEs">
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