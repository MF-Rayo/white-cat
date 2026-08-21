import { Suspense, useRef, useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { DataTable } from "@/components/ui/table";
import TerminalKitty from "@/components/ui/kitty"
import { Filter } from "@/components/ui/filter"
import { iocColumns } from "@/components/ui/tableColumns";
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

const apiDate = fetchData(endpoints.iocDates)
const apiCountry = fetchData(endpoints.iocCountry)

const palette = [
  '#f87171','#fb923c','#fbbf24','#a3e635','#34d399',
  '#22d3ee','#60a5fa','#a78bfa','#f472b6','#e879f9'
]

function buildColorMap(data) {
  const map = {}
  let idx = 0
  data.forEach(item => {
    const key = item.malware_printable || item.malware || item.threat_type || "unknown"
    if (!map[key]) {
      map[key] = palette[idx % palette.length]
      idx++
    }
  })
  return map
}

function makeIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:10px;height:10px;
      border-radius:50%;
      background: ${color};
      box-shadow:0 0 6px ${color}88;
    "></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })
}

function row(color, label, value) {
  if (!value) return ""
  return `<div style="display:flex;gap:6px;margin-bottom:3px">
    <span style="color:${color};min-width:80px;flex-shrink:0">${label}:</span>
    <span style="color:var(--text-color);word-break:break-all;overflow-wrap:anywhere">${value}</span>
  </div>`
}

function IocMarkers({ data, colorMap }) {
  const map = useMap()
  const clusterRef = useRef(null)

  useEffect(() => {
    
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current)
      clusterRef.current = null
    }

    if (!data.length) return

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 40,
      chunkedLoading: true,
    })

    data.forEach(item => {
      const lat = item.lat
      const lon = item.lon ?? item.long ?? item.longitude
      if (lat == null || lon == null) return

      const key = item.malware_printable || item.malware || item.threat_type || "unknown"
      const color = colorMap[key] || '#60a5fa'
      const marker = L.marker([lat, lon], { icon: makeIcon(color) })

      marker.bindPopup(`
        <div style="font-family: 'Poppins', sans-serif; font-size: 12px; min-width: 260px; background: color-mix(in srgb, var(--bg-color) 60%, transparent); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(20px); padding: 4px; border: 1px solid ${color}; border-radius: 2%;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
            <span style="width:9px;height:9px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color}88;flex-shrink:0"></span>
            <span style="color:${color};font-weight:bold">${key}</span>
          </div>
          ${row(color, item.ioc_type || "IOC", `<code>${item.ioc_value}</code>`)}
          ${row(color, "IP", item.ip)}
          ${row(color, "Reporter", item.reporter)}
          ${row(color, "Country", item.country)}
          ${row(color, "City", item.city)}
          ${row(color, "Type", item.threat_type)}
          ${row(color, "UTC", item.first_seen_utc)}
          ${row(color, "Confidence", item.confidence_level != null ? `${item.confidence_level}%` : null)}
          ${item.reference ? row(color, "Ref", `<a href="${item.reference}" target="_blank" style="color:${color}">${item.reference}</a>`) : ""}
        </div>
      `, { maxWidth: 400 })

      cluster.addLayer(marker)
    })

    map.addLayer(cluster)
    clusterRef.current = cluster

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current)
        clusterRef.current = null
      }
    }
  }, [data, colorMap, map])

  return null
}

function Legend({ colorMap }) {
  const entries = Object.entries(colorMap)
  if (!entries.length) return null

  return (
    <div style={{
      position: "absolute", bottom: 0, right: 0, zIndex: 1000,
      background: "color-mix(in srgb, var(--bg-color) 60%, transparent)", 
      backdropFilter: "blur(24px)", webkitBackdropfilter: "blur(20px)",
      border: "1px solid var(--border-color)", borderRadius: "15px",
      padding: "12px 14px", minWidth: "200px", maxWidth: "600px", maxHeight: "400px",
      overflowY: "auto", fontFamily: "monospace", fontSize: "11px"
    }}>
      <p style={{ color: "var(--primary-color)", fontWeight: "bold", marginBottom: 8, letterSpacing: "0.1em", margin: "0 0 8px" }}>
        Legend 
      </p>
      {entries.map(([name, color]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: color,
            boxShadow: `0 0 5px ${color}88`, flexShrink: 0
          }} />
          <span style={{
            color: "#aaa", overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", maxWidth: 150
          }}>{name}</span>
        </div>
      ))}
    </div>
  )
}

function IocContent({ apiData, searchTerm, tableRef }) {
  const rawData = apiData.read();
  const arr = Array.isArray(rawData) ? rawData : [];
  const colorMap = useMemo(() => buildColorMap(arr), [arr]);

  const filtered = arr.filter((item) =>
    item.ioc_value?.toLowerCase().includes(searchTerm?.toLowerCase() ?? "")
  );

  return (
    <>
      <div style={{ position: "relative", height: "100vh", width: "100%", background: "#262626", zIndex: 1 }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={16}
          maxBounds={[[-180, -360], [180, 360]]}
          attributionControl={false}
          maxBoundsViscosity={1.0}
          style={{ height: "100%", width: "100%", background: "#262626" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={16}
            noWrap={true}
            keepBuffer={4}
            errorTileUrl="data:image/png;base64,iVBORw0KGgo="
          />
          <IocMarkers data={filtered} colorMap={colorMap} />
        </MapContainer>
        <Legend colorMap={colorMap} />

        {/* botón flotante para bajar a la tabla */}
        <button
          onClick={() => tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          style={{
            position: "absolute", top: 20, right: 20, zIndex: 1000,
            background: "color-mix(in srgb, var(--bg-color) 70%, transparent)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border-color)",
            borderRadius: "10px",
            padding: "8px 14px",
            color: "var(--primary-color)",
            fontFamily: "monospace",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ↓ View Table
        </button>
      </div>

      <div ref={tableRef} className="py-4 px-4">
        <DataTable rows={arr} columns={iocColumns()} />
      </div>
    </>
  );
}

export default function IocMap() {
  const [search] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const tableRef = useRef(null);

  const params = new URLSearchParams();
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedCountry !== "all") params.set("country", selectedCountry);

  const iocUrl = params.toString()
    ? `${endpoints.ioc}?${params}`
    : endpoints.ioc;

  const apiData = fetchData(iocUrl);

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
            </>
          }>
            <Filter
              label="All Countries"
              apiData={apiCountry}
              selected={selectedCountry}
              onChange={setSelectedCountry}
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
      <div style={{ position: "relative", width: "100%"}}>
        <ErrorBoundary resetKey={iocUrl} onRetry={() => invalidate(iocUrl)}>
          <Suspense fallback={
            <div style={{
              position: "relative", height: "100vh", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "var(--bg-color)", zIndex: 1,
              fontFamily: "monospace", color: "var(--primary-color)", fontSize: 14
            }}> Loading IOCs...</div>
          }>
            <IocContent apiData={apiData} searchTerm={search} tableRef={tableRef} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </TerminalKitty>
  )
}