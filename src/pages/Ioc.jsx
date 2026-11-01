import { Suspense } from "react"
import { ErrorBoundary } from "@/hooks/ErrorBoundary"

import { FilterBar, FilterProvider, BarChart,
  DropdownFilter, useMetricFilters, MetricProvider } from "metricui";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import { TopSource } from "@/components/ui/table/Source"
import TableUI  from "@/components/ui/table/Feed";
import IocMap from "@/components/ui/map/SimpleMap.jsx";
import Container from "@/components/Container"

const apiDate       = fetchData(endpoints.iocDate)
const apiHour       = fetchData(endpoints.iocHour)
const apiCountry    = fetchData(endpoints.iocCountry)
const apiMalware    = fetchData(endpoints.iocMalware)
const apiIocType    = fetchData(endpoints.iocType)
const apiTheartType = fetchData(endpoints.threatType)
const apiConfidence = fetchData(endpoints.iocConfidence)
const apiStatus      = fetchData(endpoints.iocStatus)

function DataMap({ apiData }) {
  const data        = apiData.read();
  const dates       = apiDate.read();
  const hours       = apiHour.read();
  const confidences = apiConfidence.read();
  const country     = apiCountry.read();
  const malware     = apiMalware.read();
  const iocType     = apiIocType.read();
  const threatType  = apiTheartType.read();
  const status      = apiStatus.read()

  return(
    <>
      <FilterBar className="card-metricui">

        <DropdownFilter
          label="Today's IOC"
          allLabel="All Dates"
          options={dates}
          field="date"
          showAll
        />

        <DropdownFilter
          label="All UTC Hours"
          allLabel="All UTC Hours"
          options={hours}
          field="hour"
          showAll
        />

        <DropdownFilter
          label="All Malware"
          allLabel="All Malware"
          options={malware}
          field="malware"
          showAll
        />

        <DropdownFilter
          label="All Threat Types"
          allLabel="All Threat Types"
          options={threatType}
          field="threat_type"
          showAll
        />

        <DropdownFilter
          label="All IOC Types"
          allLabel="All IOC Types"
          options={iocType}
          field="ioc_type"
          showAll
        />

        <DropdownFilter
          label="Confidence Level"
          allLabel="All Confidence Levels"
          options={confidences}
          field="confidence"
          showAll
        />

        <DropdownFilter
          label="Status"
          allLabel="All Statuses"
          options={status}
          field="status"
          showAll
        />

        <DropdownFilter
          label="All Sources"
          allLabel="All Sources"
          options={country}
          field="country"
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
          <TopSource data={data.sources}/>
        </div> 
      </div>
      </MetricProvider>
    </>
  )
}

function IOCBody() {
  const filters = useMetricFilters();

  const selectedMalware     = filters?.dimensions?.malware     || "all";
  const selectedCountry     = filters?.dimensions?.country     || "all";
  const selectedDate        = filters?.dimensions?.date        || "all";
  const selectedType        = filters?.dimensions?.ioc_type    || "all";
  const selectedThreatType  = filters?.dimensions?.threat_type || "all";
  const selectedConfidence  = filters?.dimensions?.confidence  || "all";
  const selectedStatus      = filters?.dimensions?.status      || "all";
  const selectedHour        = filters?.dimensions?.hour      || "all";

  const params = new URLSearchParams();
  if (selectedMalware    !== "all") params.set("malware", selectedMalware);
  if (selectedCountry    !== "all") params.set("country", selectedCountry);
  if (selectedDate       !== "all") params.set("date", selectedDate);
  if (selectedType       !== "all") params.set("ioc_type", selectedType);
  if (selectedThreatType !== "all") params.set("threat_type", selectedThreatType);
  if (selectedConfidence !== "all") params.set("confidence", selectedConfidence);
  if (selectedStatus     !== "all") params.set("status", selectedStatus);
  if (selectedHour       !== "all") params.set("hour", selectedHour);


  const theartUrl = params.toString()
    ? `${endpoints.ioc}?${params}`
    : endpoints.ioc;

  const apiData = fetchData(theartUrl);

  return (
    <Container path="~/Reported IOC">
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