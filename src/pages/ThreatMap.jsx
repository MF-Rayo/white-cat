import { Suspense, useState } from "react"

import { ThreatMap } from "@/components/ui/map.jsx"

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import TerminalKitty from "@/components/ui/kitty"
import { Filter } from "@/components/ui/filter"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/hooks/ErrorBoundary.jsx";

import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

const apiDate = fetchData(endpoints.threatDates)
const apiCountry = fetchData(endpoints.threatCountry)
const apiThreat = fetchData(endpoints.threatName)

export default function ThreatPage() {

  const [search] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedThreat, setSelectedThreat] = useState("all");
  
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
      path="~/Threat MAP"
      headerContent={
        <ErrorBoundary
          resetKey={`${endpoints.iocCountry}|${endpoints.iocDates}`}
          onRetry={() => {
            invalidate(endpoints.iocCountry);
            invalidate(endpoints.iocDates);
          }}
        >
          <Suspense fallback={
            <>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-40" />
            </>
          }>
            <Filter
              label="All Countries"
              apiData={apiCountry}
              selected={selectedCountry}
              onChange={setSelectedCountry}
            />
            <Filter
              label="All Threat"
              apiData={apiThreat}
              selected={selectedThreat}
              onChange={setSelectedThreat}
            />
            <Filter
              label="Today's Report"
              apiData={apiDate}
              selected={selectedDate}
              onChange={setSelectedDate}
            />
          </Suspense>
        </ErrorBoundary>
      }
    >
      <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
        <ErrorBoundary resetKey={theartUrl} onRetry={() => invalidate(theartUrl)}>
          <Suspense fallback={
            <div style={{
              position: "relative", height: "100vh", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "var(--bg-color)", zIndex: 1,
              fontFamily: "monospace", color: "var(--primary-color)", fontSize: 14
            }}> Loading Threat Map...</div>
          }>
            <ThreatMap apiData={apiData}></ThreatMap>
          </Suspense>
        </ErrorBoundary>
      </div>
    </TerminalKitty>
  )
}