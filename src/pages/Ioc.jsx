import { Suspense } from "react"
import { ErrorBoundary } from "@/hooks/ErrorBoundary"

import { FilterBar, FilterProvider, DataTable, BarChart, DonutChart,
  DropdownFilter, useMetricFilters, MetricProvider } from "metricui";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import TableUI  from "@/components/ui/table";
import IocMap from "@/components/ui/simpleMap";
import Container from "@/components/Container"

const apiDate       = fetchData(endpoints.iocDate)
const apiCountry    = fetchData(endpoints.iocCountry)
const apiMalware    = fetchData(endpoints.iocMalware)
const apiIocType    = fetchData(endpoints.iocType)
const apiTheartType = fetchData(endpoints.threatType)

function DataMap({ apiData }) {
  const data        = apiData.read();

  const dates       = apiDate.read();
  const country     = apiCountry.read();
  const malware     = apiMalware.read();
  const iocType     = apiIocType.read();
  const threatType  = apiTheartType.read();
  
  return(
    <>
      <FilterBar className="card-metricui">

        <DropdownFilter
          label="All Malware"
          allLabel="All Malware"
          options={malware}
          field="malware"
          showAll
        />
  
        <DropdownFilter
          label="All Country"
          options={country}
          field="country"
          showAll
          allLabel="All Countries"
        />

        <DropdownFilter
          label="All IOC Types"
          allLabel="All IOC Types"
          options={iocType}
          field="ioc_type"
          showAll
        />

        <DropdownFilter
          label="All Threat Types"
          options={threatType}
          field="threat_type"
          showAll
          allLabel="All Threat Types"
        />

        <DropdownFilter
          label="Today's IOC"
          allLabel="Today's IOC"
          options={dates}
          field="date"
          showAll
        />

      </FilterBar>      

      <MetricProvider exportable> 

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd)">
        <div className="lg:col-span-4">
          <TableUI dataTable={data}/>
        </div>    
        
        <div className="grid grid-cols-1 lg:col-span-2 gap-(--gp)">
          <IocMap data={data}/>

          <DataTable
              title="TOP IOC SOURCES"
              data={data?.sources.map((item) => ({
                country: item.country,
                reports: item.count,
              }))}
              pageSize={5}
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

  const selectedMalware     = filters?.dimensions?.malware || "all";
  const selectedCountry     = filters?.dimensions?.country || "all";
  const selectedDate        = filters?.dimensions?.date || "all";
  const selectedType        = filters?.dimensions?.ioc_type || "all";
  const selectedThreatType  = filters?.dimensions?.threat_type || "all";
  
  const params = new URLSearchParams();
  if (selectedMalware !== "all") params.set("malware", selectedMalware);
  if (selectedCountry !== "all") params.set("country", selectedCountry);
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedType !== "all") params.set("ioc_type", selectedType);
  if (selectedThreatType !== "all") params.set("threat_type", selectedThreatType);


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
              <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
            </div>    
            <div className="grid grid-cols-1 lg:col-span-2 gap-(--gp)">
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