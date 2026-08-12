import { Suspense } from "react"
import { Panel, CustomTooltip, PanelSkeleton } from "@/components/ui/panel"
import TerminalKitty from "@/components/ui/kitty"
import { KpiCard, KpiCardSkeleton } from "@/components/ui/card"
import { DataTable } from "@/components/ui/table";
import { groupsColumns, newsColumns, attacksColumns, RowSkeleton } from "@/components/ui/tableColumns";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet"

import { ShieldAlert, Globe2, Activity, Skull } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const COLORS = {
  red: "var(--danger-color)",
  amber: "var(--warning-color)",
  cyan: "var(--info-color)",
  mid: "var(--text-secondary)",
  border: "var(--border-hover)",
}

function colorByRank(index) {
  if (index < 3) return COLORS.red
  if (index < 6) return COLORS.amber
  return COLORS.cyan
}

function getDeltaProps(pct) {
  const isUp = pct >= 0
  return {
    deltaTone: isUp ? "up" : "down",
    delta: `${Math.abs(pct)}%`,
  }
}

const apiData = fetchData(endpoints.summary)

function DashboardContent() {
  const data = apiData.read()

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="IOC Reports Today"
          value={data.ioc_today_count}
          {...getDeltaProps(data.ioc_today_pct)}
          icon={Activity} accent={"var(--primary-color)"}
        />
        <KpiCard label="IOC Reports Week"
          value={data.ioc_week_count}
          {...getDeltaProps(data.ioc_week_pct)}
          icon={ShieldAlert} accent={"var(--primary-color)"}
        />
        <KpiCard label="Active Groups"
          value={data.active_groups_count}
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
        <Panel title="Today's Top 10 IOC Origins" icon={Globe2} className="lg:col-span-3 rounded-lg">
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
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
            dragging={false}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            style={{ width: "100%", height: "100%", background: "#262626" }}
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
                <LeafletTooltip direction="top" className="bg-(--bg-color)! text-(--text-color)! border-(--bg-color)!">
                  {c.country}: {c.count}
                </LeafletTooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
            
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
        <div>
          <DataTable
            linkKey="post_url"
            rows={data.top_activegroups}
            columns={groupsColumns()}
          />
        </div>

        <div>
          <DataTable
            rows={data.top_attacks}
            columns={attacksColumns()}
          />
        </div>

        <div>
          <DataTable
            linkKey="url"
            rows={data.top_news}
            columns={newsColumns()}
          />
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {

  return (
    <TerminalKitty path="~/Dashboard">
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
          <DashboardContent />
        </Suspense>
      </div>
    </TerminalKitty>
  )
}