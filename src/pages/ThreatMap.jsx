import { Suspense, useState } from "react"
import { ThreatMap } from "@/components/ui/map"
import TableUI  from "@/components/ui/table";

import { KpiCard, DonutChart, FilterBar, FilterProvider, 
  DropdownFilter, useMetricFilters, LineChart, MetricProvider } from "metricui";

import { ShieldAlert, Earth, Link, Link2, Network } from "lucide-react"

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { Panel } from "@/components/ui/panel";
import Container from "@/components/Container"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/hooks/ErrorBoundary";

import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

const apiDate = fetchData(endpoints.threatDates)
const apiCountry = fetchData(endpoints.threatCountry)
const apiThreat = fetchData(endpoints.threatName)

function DataMap({ apiData }) {

  const data = apiData.read();

  // COUNT SOURCES
  const country = data.map(item => item.country);
  const unique = new Set(country);
  const sources = unique.size;

  // COUNT URLs
  const urlItems = data.filter(item => item.ioc_type === "url");
  const urls = urlItems.length;

  // COUNT DOMAINS
  const domainItems = data.filter(item => item.ioc_type === "domain");
  const domains = domainItems.length;

  // COUNT IP
  const ipItems = data.filter(item => item.ioc_type === "ip:port");
  const ips = ipItems.length;

  // Procesar los datos a mostrar en el chart
  const donutData = Object.entries(
    data.reduce((acc, item) => {
      const key = item.malware_printable;
      if (key) {
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {})
  ).map(([key, count]) => ({
    id: key.toLowerCase().replace(/\s+/g, "_"),
    label: key,
    value: count
  }));


  return(
    <>
      <MetricProvider exportable>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gap) p-(--pd)">
        <Panel title="Threat Map" className="lg:col-span-5 rounded-[var(--radius-card)] overflow-hidden min-h-[70vh]">
          <ThreatMap apiData={apiData}></ThreatMap>
        </Panel>      
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-(--gap)">
          <KpiCard
            title="Reported URLs"
            value={urls}
            format="number"
            icon={<Link />}
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
            icon={<Link2 />}
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
            icon={<Network />}
            comparison={{ value: domains }}
            sparkline={{
              data: [urls, domains, ips],
              type: "line",
              interactive: true,
            }}
            className="card-metricui"
          />
          <KpiCard
            title="Threat Sources"
            value={sources}
            format="number"
            icon={<Earth />}
            className="card-metricui"
          />
          <KpiCard
            title="Threats reported"
            value={data.length}
            format="number"
            icon={<ShieldAlert />}
            className="card-metricui"
          />
        </div>
      </div>

      {data.length > 0 && (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gap) px-(--pd) pb-(--pd)">
        <div className="lg:col-span-4">
          <TableUI dataTable={data} />
        </div>
        <div className="lg:col-span-2">
            <DonutChart
              data={donutData}
              title="Top Threats Today"
              centerValue={data.length}
              centerLabel="Total"
              enableArcLabels
              enableArcLinkLabels
              arcLabelsSkipAngle={15}
              arcLinkLabelsSkipAngle={15}
              className="card-metricui h-full flex-1"
            />
        </div>
      </div>
      )}
      </MetricProvider>
    </>
  )
}


function ThreatFilters() {
  const country = apiCountry.read();
  const dates = apiDate.read();
  const threat = apiThreat.read();

  return (
    <div className="flex items-center gap-(--gap)">
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
      path="~/Threat Map"
      headerContent={
        <ErrorBoundary
          resetKey={`${endpoints.iocCountry}|${endpoints.iocDates}`}
          onRetry={() => {
            invalidate(endpoints.iocCountry);
            invalidate(endpoints.iocDates);
          }}
        >
          <Suspense>
            <ThreatFilters/>
          </Suspense>
        </ErrorBoundary>
      }
    >
      <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
        <ErrorBoundary resetKey={theartUrl} onRetry={() => invalidate(theartUrl)}>
          <Suspense fallback={
            <>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gap) p-(--pd)">
              <Panel title="Threat Map" className="lg:col-span-5 rounded-[var(--radius-card)] overflow-hidden min-h-[70vh]">
                <Skeleton className="h-full"/>
              </Panel> 
              <div className="lg:col-span-1 grid grid-cols-1 gap-(--gap)">
                <KpiCard loading className="card-metricui"/>
                <KpiCard loading className="card-metricui"/>
                <KpiCard loading className="card-metricui"/>
                <KpiCard loading className="card-metricui"/>
                <KpiCard loading className="card-metricui"/>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gap) px-(--pd) pb-(--pd)">
              <div className="lg:col-span-4 rounded-[var(--radius-card)] overflow-hidden">
                <LineChart data={[]} title="Map" loading className="card-metricui"/>
              </div>
              <div className="lg:col-span-2 rounded-[var(--radius-card)] overflow-hidden">
                <LineChart data={[]} title="chart" loading className="card-metricui"/>
              </div>
            </div>
            </>
          }>
            <DataMap apiData={apiData} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Container>
  )
}


export default function Threat() {
  const [search] = useState("");

  return (
    <FilterProvider>
      <ThreatBody search={search} />
    </FilterProvider>
  );
}