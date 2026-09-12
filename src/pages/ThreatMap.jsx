import { Suspense, useState } from "react"
import { ShieldAlert, Globe2, Activity, Skull } from "lucide-react"
import { ThreatMap } from "@/components/ui/map"
import TableUI  from "@/components/ui/table";

import { KpiCard, DonutChart, FilterBar, FilterProvider, 
  DropdownFilter, useMetricFilters, LineChart } from "metricui";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { Panel } from "@/components/ui/panel";
import TerminalKitty from "@/components/ui/kitty"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/hooks/ErrorBoundary";

import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

const apiDate = fetchData(endpoints.threatDates)
const apiCountry = fetchData(endpoints.threatCountry)
const apiThreat = fetchData(endpoints.threatName)
const apiSummary = fetchData(endpoints.summary)

function DataMap({ apiData, apiSummary }) {

  const data = apiSummary.read();
  const dataTable = apiData.read();

  return(
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <KpiCard
          title="Today's Threats"
          value={data.threat_today}
          format="number"
          comparison={{ value: data.threat_yesterday }}
          comparisonLabel="vs yesterday"
          sparkline={{
            data: data.threat_week_sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />

        <KpiCard
          title="Threats Of The Week"
          value={data.threat_week}
          format="number"
          comparison={{ value: data.threat_last_week }}
          comparisonLabel="vs last week"
          sparkline={{
            data: data.threat_week_sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />

        <KpiCard
          title="Today's Threat Sources"
          value={data.source_of_threats}
          format="number"
          comparison={{ value: data.source_of_yesterday_threats }}
          comparisonLabel="vs yesterday"
          sparkline={{
            data: data.source_of_week_sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-6 gap-4">
        <Panel title="Threat Map" 
          className="lg:col-span-4 rounded-[var(--radius-card,14px)] overflow-hidden min-h-[70vh]">
          <ThreatMap apiData={apiData}></ThreatMap>
        </Panel>
        <div className="lg:col-span-2">
          <DonutChart
            data={data.top_threats_today}
            title="Top Threats Today"
            enableArcLabels
            enableArcLinkLabels
            arcLabelsSkipAngle={15}
            arcLinkLabelsSkipAngle={15}
            className="card-metricui"
          />   
        </div>
      </div>
      <div className="p-4">
        {dataTable.length > 0 && (
          <TableUI dataTable={dataTable} />
        )}
      </div>
    </>
  )
}


function ThreatFilters() {
  const country = apiCountry.read();
  const dates = apiDate.read();
  const threat = apiThreat.read();

  return (
    <div className="flex items-center gap-2">
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
    <TerminalKitty
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              <KpiCard loading className="card-metricui"/>
              <KpiCard loading className="card-metricui"/>
              <KpiCard loading className="card-metricui"/>
            </div>
            <div className="px-4 grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-4 rounded-[var(--radius-card,14px)] overflow-hidden">
                <LineChart data={[]} title="Map" loading className="card-metricui"/>
              </div>
              <div className="lg:col-span-2 rounded-[var(--radius-card,14px)] overflow-hidden">
                <LineChart data={[]} title="chart" loading className="card-metricui"/>
              </div>
            </div>
            <div className="p-4 w-full">
              <LineChart data={[]} title="Table" loading className="card-metricui"/>
            </div>
            </>
          }>
            <DataMap apiData={apiData} apiSummary={apiSummary}/>
          </Suspense>
        </ErrorBoundary>
      </div>
    </TerminalKitty>
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