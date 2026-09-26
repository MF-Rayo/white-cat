import { Suspense, useState } from "react"
import { ThreatMap } from "@/components/ui/map"
import TableUI  from "@/components/ui/table";
import { ErrorBoundary } from "@/hooks/ErrorBoundary"

import { KpiCard, FilterBar, FilterProvider, DataTable, 
  DropdownFilter, useMetricFilters, MetricProvider } from "metricui";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { Panel } from "@/components/ui/panel";
import Container from "@/components/Container"
import { Skeleton } from "@/components/ui/skeleton"

import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

const apiDate = fetchData(endpoints.threatDates)
const apiCountry = fetchData(endpoints.threatCountry)
const apiThreat = fetchData(endpoints.threatName)

function DataMap({ apiData }) {

  const data = apiData.read();

  const country = data.map(item => item.country);
  const unique = new Set(country);
  const sources = unique.size;

  const urlItems = data.filter(item => item.ioc_type === "url");
  const urls = urlItems.length;

  const domainItems = data.filter(item => item.ioc_type === "domain");
  const domains = domainItems.length;

  const ipItems = data.filter(item => item.ioc_type === "ip:port");
  const ips = ipItems.length;

  return(
    <>
      <MetricProvider exportable>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp)">
        <Panel title="IOC Map" className="lg:col-span-5 rounded-[var(--radius-card)] overflow-hidden min-h-[70vh] z-0">
          <ThreatMap apiData={apiData}></ThreatMap>
        </Panel>      
        <div className="grid grid-cols-1 lg:grid-cols-1">
          <KpiCard
            title="Threats reported"
            value={data.length}
            format="number"
            className="card-metricui"
          />
          <KpiCard
            title="Threat Sources"
            value={sources}
            format="number"
            className="card-metricui"
          />
          <KpiCard
            title="Reported URLs"
            value={urls}
            format="number"
            comparison={{ value: domains }}
            sparkline={{
              data: [ips, domains, urls],
              type: "line",
              interactive: true,
            }}
            className="card-metricui"
          />
          <KpiCard
            title="Reported Domains"
            value={domains}
            format="number"
            comparison={{ value: urls }}
            sparkline={{
              data: [ips, urls, domains],
              type: "line",
              interactive: true,
            }}
            className="card-metricui"
          />
          <KpiCard
            title="Reported IPs"
            value={ips}
            format="number"
            comparison={{ value: domains }}
            sparkline={{
              data: [urls, domains, ips],
              type: "line",
              interactive: true,
            }}
            className="card-metricui"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-(--gp) pt-(--pd)">
        <TableUI dataTable={data}/>
      </div>
      
      </MetricProvider>
    </>
  )
}


function ThreatFilters() {
  const country = apiCountry.read();
  const dates = apiDate.read();
  const threat = apiThreat.read();

  return (
    <div className="flex items-center gap-(--gp)">
      <div className="dropdown-align-left">
        <DropdownFilter
          label="Threat"
          options={threat}
          field="name"
          showAll
          allLabel="All Threats"
        />
      </div>
      <div className="dropdown-align-left">
        <DropdownFilter
          label="Country"
          options={country}
          field="country"
          showAll
          allLabel="All Countries"
        />
      </div>
      <div className="dropdown-align-left">
        <DropdownFilter
          label="Date"
          options={dates}
          field="date"
          showAll
          allLabel="Today's Threat"
        />
      </div>
    </div>
  );
}


function ThreatBody( { search } ) {
  const filters = useMetricFilters();

  const selectedCountry = filters?.dimensions?.country || "all";
  const selectedDate = filters?.dimensions?.date || "all";
  const selectedThreat = filters?.dimensions?.name || "all";
  
  const params = new URLSearchParams();
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedCountry !== "all") params.set("country", selectedCountry);
  if (selectedThreat !== "all") params.set("name", selectedThreat);
  
  const theartUrl = params.toString()
    ? `${endpoints.threat}?${params}`
    : endpoints.threat;

  const apiData = fetchData(theartUrl);

  return (
    <Container
      path="~/IOC Map"
      headerContent={<Suspense><ThreatFilters/></Suspense>}
    >
      <ErrorBoundary resetKey={theartUrl}>
      <Suspense fallback={
        <>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp)">
          <Panel title="IOC Map" className="lg:col-span-5 rounded-[var(--radius-card)] overflow-hidden min-h-[72vh]">
            <Skeleton className="h-full"/>
          </Panel> 
          <div className="lg:col-span-1 grid grid-cols-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <KpiCard key={index} loading className="card-metricui" />
            ))}
          </div>
        </div>
        <div className="gap-(--gp) py-(--pd)">
          <DataTable data={[]} title="IOC Feed" loading className="card-metricui"/>
        </div>
        </>
      }>
        <DataMap apiData={apiData} />
      </Suspense>
      </ErrorBoundary>
    </Container>
  )
}


export default function ThreatPage() {
  const [search] = useState("");

  return (
    <FilterProvider>
      <ThreatBody search={search} />
    </FilterProvider>
  );
}