import { Suspense } from "react"
import { Panel, CustomTooltip, PanelSkeleton } from "@/components/ui/panel"
import TerminalKitty from "@/components/ui/kitty"
import { Skeleton } from "@/components/ui/skeleton"
import { KpiCard, KpiCardSkeleton } from "@/components/ui/card"
import { DataTable } from "@/components/ui/table";
import { groupsColumns, newsColumns, attacksColumns, RowSkeleton } from "@/components/ui/tableColumns";
import { ChartPieActiveGroups } from "@/components/ui/chart"
import { LiveData } from "@/components/ui/live"

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet"

import { ShieldAlert, Globe2, Activity, Skull } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const COLORS = [
  "var(--bar_a)",
  "var(--bar_b)",
  "var(--bar_c)",
  "var(--bar_d)",
  "var(--bar_e)",
  "var(--bar_f)",
  "var(--bar_g)",
  "var(--bar_h)",
  "var(--bar_i)",
  "var(--bar_j)",
]

function colorByRank(index) {
  return COLORS[index % COLORS.length]
}

function getDeltaProps(pct) {
  const isUp = pct >= 0
  return {
    deltaTone: isUp ? "up" : "down",
    delta: `${Math.abs(pct)}%`,
  }
}

function LiveDataWrapper({ apiData }) {
  const data = apiData.read()
  return <LiveData data={data} />
}

function DashboardContent({ apiData }) {
  const data = apiData.read()

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Threat Today"
          value={data.threat_today_count}
          {...getDeltaProps(data.threat_today_pct)}
          icon={Activity} accent={"var(--primary-color)"}
        />
        <KpiCard label="Threat Week"
          value={data.threat_week_count}
          {...getDeltaProps(data.threat_week_pct)}
          icon={ShieldAlert} accent={"var(--primary-color)"}
        />
        <KpiCard label="Active Groups"
          value={data.activegroups_today_count}
          {...getDeltaProps(data.active_groups_pct)}
          icon={Skull} accent={"var(--primary-color)"}
        />
        <KpiCard label="Countries"
          value={data.countries_count}
          {...getDeltaProps(data.countries_pct)}
          icon={Globe2} accent={"var(--primary-color)"}
        />
      </div>

      <div className="pt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Panel title="Today's Top 10 IOC Origins" icon={Globe2} className="lg:col-span-3 rounded-[var(--radius-card,14px)]">
          <div className="min-h-[300px] h-full w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.top_countries}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: COLORS.mid, fontSize: 10 }}
                  axisLine={{ stroke: COLORS.border }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  width={110}
                  tick={{ fill: COLORS.mid, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.top_countries.map((_, i) => (
                    <Cell key={i} fill={colorByRank(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="lg:col-span-2 bg-(--bg-color)/60 backdrop-blur-xl rounded-lg h-[300px] lg:h-full overflow-hidden">
          <MapContainer
            center={[20, 0]}
            zoom={1}
            minZoom={1}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
            dragging={false}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            style={{
              width: "100%",
              height: "100%",
              background: "#262626",
            }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={16}
              noWrap={true}
              keepBuffer={4}
              errorTileUrl="data:image/png;base64,iVBORw0KGgo="
            />

            {data.top_countries.map((c, i) => (
              <CircleMarker
                key={c.country}
                center={[c.lat, c.long]}
                radius={Math.max(4, Math.sqrt(c.count) * 1.5)}
                pathOptions={{
                  color: colorByRank(i),
                  fillColor: colorByRank(i),
                  fillOpacity: 0.5,
                  weight: 1,
                }}
              >
                <LeafletTooltip
                  direction="top"
                  className="bg-(--bg-color)! text-(--text-color)! border-(--bg-color)!"
                >
                  {c.country}: {c.count}
                </LeafletTooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
        <div>
          <ChartPieActiveGroups className="bg-(--bg-color)/60 backdrop-blur-xl rounded-(--radius-card,14px) h-[100%]" value={data.top_threats} />
        </div>
        <div>
          <DataTable
            rows={data.top_threats}
            columns={attacksColumns()}
          />
        </div>
        <div>
          <DataTable
            linkKey="post_url"
            rows={data.top_activegroups}
            columns={groupsColumns()}
          />
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {
  const apiData = fetchData(endpoints.summary)

  return (
    <TerminalKitty path="~/Dashboard"
      headerContent={
        <Suspense fallback={
          <>
            <Skeleton className="h-8 w-100" />
          </>
        }>
          <LiveDataWrapper apiData={apiData} />
        </Suspense>
      }>
      <div className="min-h-screen p-4">
        <Suspense fallback={
          <>
            <KpiCardSkeleton />
            <PanelSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
              <RowSkeleton />
              <RowSkeleton />
              <RowSkeleton />
            </div>
          </>
        }>
          <DashboardContent apiData={apiData} />
        </Suspense>
      </div>
    </TerminalKitty>
  )
}