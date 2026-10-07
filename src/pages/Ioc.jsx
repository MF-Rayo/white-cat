import { Suspense, useState } from "react"
import { ErrorBoundary } from "@/hooks/ErrorBoundary"

import { FilterBar, FilterProvider, DataTable, BarChart, DonutChart,
  DropdownFilter, useMetricFilters, MetricProvider, Choropleth, worldFeatures } from "metricui";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import TableUI  from "@/components/ui/table";
import Container from "@/components/Container"

const apiDate = fetchData(endpoints.iocDate)
const apiCountry = fetchData(endpoints.iocCountry)
const apiThreat = fetchData(endpoints.iocMalware)


function DataMap({ apiData }) {
  const data = apiData.read();

  const country = apiCountry.read();
  const dates = apiDate.read();
  const threat = apiThreat.read();

  // Contar el todal de ul, domnios y ip para el barchart
  const urls = data.table.filter(item => item.ioc_type === "url").length;
  const domains = data.table.filter(item => item.ioc_type === "domain").length;
  const ips = data.table.filter(item => item.ioc_type === "ip:port").length;

  return(
    <>
      <FilterBar className="card-metricui">
        <DropdownFilter
          label="All Threat"
          options={threat}
          field="threat"
          showAll
          allLabel="All Threat"
        />

        <DropdownFilter
          label="All Country"
          options={country}
          field="country"
          showAll
          allLabel="All Countries"
        />

        <DropdownFilter
          label="Today's IOC"
          options={dates}
          field="date"
          showAll
          allLabel="Today's IOC"
        />
      </FilterBar>
      
      <MetricProvider exportable> 

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd)">
        <div className="lg:col-span-4">
          <TableUI dataTable={data}/>
        </div>    
        
        <div className="grid grid-cols-1 lg:col-span-2 gap-(--gp)">
          <Choropleth
            idField="iso"
            valueField="count"
            data={data.map}
            features={worldFeatures}
            title={`IOC MAP (${data.table.length})`}
            tooltipLabel="IOC"
            format="compact"
            scaleType="linear"
            projectionType="naturalEarth1"
            projectionScale={100}
            projectionTranslation={[0.5, 0.5]}
            legend={true}
            className="card-metricui"
            colors={[
              "var(--color_map_a)",
              "var(--color_map_b)",
              "var(--color_map_c)",
              "var(--color_map_d)",
              "var(--color_map_e)",
              "var(--color_map_f)",
              "var(--color_map_g)",
              "var(--color_map_h)",
            ]}
          />
          <BarChart
            data={data?.map?.slice(0, 10).map((item) => ({
              country: item.country,
              reports: item.count,
            }))}
            preset="horizontal"
            categories={["reports"]}
            index="country"
            title="Top Sources"
            format={{ style: "number" }}
            className="card-metricui"
          />
          <DonutChart
          data={[
            { label: "URLs", value: urls },
            { label: "Domains", value: domains },
            { label: "IPs", value: ips }
          ]}
          title="IOC"
          centerValue={data.table.length}
          centerLabel="Total"
          enableArcLabels
          enableArcLinkLabels
          legend={true}
          className="card-metricui"
        />
        </div> 
      </div>
      </MetricProvider>
    </>
  )
}

function IOCBody() {
  const filters = useMetricFilters();

  const selectedCountry = filters?.dimensions?.country || "all";
  const selectedDate = filters?.dimensions?.date || "all";
  const selectedThreat = filters?.dimensions?.threat || "all";
  
  const params = new URLSearchParams();
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedCountry !== "all") params.set("country", selectedCountry);
  if (selectedThreat !== "all") params.set("malware", selectedThreat);
  
  const theartUrl = params.toString()
    ? `${endpoints.ioc}?${params}`
    : endpoints.ioc;

  const apiData = fetchData(theartUrl);

  return (
    <Container path="~/IOC">
      <ErrorBoundary resetKey={theartUrl}>
      <Suspense fallback={
        <>
          <FilterBar className="card-metricui">
            <p className="text-(--text-color)">Loading...</p>
          </FilterBar>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd)">
            <div className="lg:col-span-4">
              <DataTable data={[]} loading className="card-metricui h-full overflow-hidden"/>
            </div>    
            <div className="grid grid-cols-1 lg:col-span-2 gap-(--gp)">
              <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
              <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
              <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
            </div> 
          </div>
        </>
      }>
        <DataMap apiData={apiData} />
      </Suspense>
      </ErrorBoundary>
    </Container>
  )
}


export default function IOCPage() {
  return (
    <FilterProvider>
      <IOCBody/>
    </FilterProvider>
  );
}