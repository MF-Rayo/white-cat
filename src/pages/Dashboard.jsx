import { Suspense } from "react"
import { Panel, PanelSkeleton } from "@/components/ui/panel"
import TerminalKitty from "@/components/ui/kitty"
import { Skeleton } from "@/components/ui/skeleton"
import { KpiCard, KpiCardSkeleton } from "@/components/ui/card"
import { ChartPieActiveGroups, BarCharts } from "@/components/ui/chart"
import { LiveData } from "@/components/ui/live"

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import { ShieldAlert, Globe2, Activity, Skull } from "lucide-react"
import { ResponsiveContainer } from "recharts"


import { SimpleMap } from "@/components/ui/map.jsx"


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

      <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 gap-4">
        <Panel title="Today's Top 10 Threat Origins" className="lg:col-span-4">
          <div className="min-h-[300px] h-full w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarCharts dataChart={data.top_countries} ></BarCharts>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="lg:col-span-2 backdrop-blur-xl rounded-[var(--radius-card,14px)] lg:h-full overflow-hidden">
          <SimpleMap data={data.top_countries} ></SimpleMap>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
        <div>
          <ChartPieActiveGroups title={"Top Threats Today"}  
            className="bg-(--bg-color)/60 backdrop-blur-xl rounded-(--radius-card,14px) h-[100%]" 
            item={"threat_type"}
            value={data.top_threats} />
        </div>
        <div>
          <ChartPieActiveGroups title={"Top Threats Week"} 
            className="bg-(--bg-color)/60 backdrop-blur-xl rounded-(--radius-card,14px) h-[100%]" 
            item={"threat_type"}
            value={data.top_threats_week} />
        </div>
        <div>
          <ChartPieActiveGroups title={"Top Active Groups"} 
            className="bg-(--bg-color)/60 backdrop-blur-xl rounded-(--radius-card,14px) h-[100%]" 
            item={"group_name"}
            value={data.top_activegroups} />
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </div>
            <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 gap-4">
              <PanelSkeleton className="min-h-[300px] lg:col-span-4" />
              <PanelSkeleton className="min-h-[300px] lg:col-span-2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
              <PanelSkeleton className="min-h-[300px]" />
              <PanelSkeleton className="min-h-[300px]" />
              <PanelSkeleton className="min-h-[300px]" />
            </div>
          </>
        }>
          <DashboardContent apiData={apiData} />
        </Suspense>
      </div>
    </TerminalKitty>
  )
}