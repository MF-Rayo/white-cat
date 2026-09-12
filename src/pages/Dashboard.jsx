import { Suspense } from "react"
import { ResponsiveContainer } from "recharts"
import { Panel } from "@/components/ui/panel";
import TerminalKitty from "@/components/ui/kitty"

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { SimpleMap } from "@/components/ui/map"
import { KpiCard, AreaChart, LineChart, DonutChart, BarChart } from "metricui";


export function sparklineToAreaChartData(sparkline, seriesId) {
  const days = sparkline.length; 
  const today = new Date(); 

  const todayUTC = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const startUTC = todayUTC - (days - 1) * 24 * 60 * 60 * 1000;

  const data = sparkline.map((value, i) => {
    const dayTimestamp = startUTC + i * 24 * 60 * 60 * 1000;
    const d = new Date(dayTimestamp);
    
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0"); 
    const day = String(d.getUTCDate()).padStart(2, "0");
    
    const label = `${month}-${day}`; 
    
    return { x: label, y: value };
  });

  return [{ id: seriesId, data }];
}


function DashboardContent({ apiData }) {
  const data = apiData.read()

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

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

        <KpiCard
          title="Today's Active Groups"
          value={data.active_groups}
          format="number"
          comparison={{ value: data.active_groups_yesterday }}
          comparisonLabel="vs yesterday"
          sparkline={{
            data: data.active_groups_sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />

      </div>

      <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 gap-4">

        <div className="lg:col-span-4">
          <AreaChart
            data={sparklineToAreaChartData(data.threat_week_sparkline, "Threat")}
            title="Threats Of The Week"
            format={{ style: "number" }}
            className="card-metricui"
          />
        </div>
       
        <Panel title="The 10 sources of reported threats" 
          className="lg:col-span-2 lg:h-full rounded-[var(--radius-card,14px)]
          font-medium overflow-hidden h-[300px]">
          <SimpleMap data={data.top_countries_today}></SimpleMap>
        </Panel>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4 items-stretch">

        <DonutChart
          data={data.top_threats_today}
          title="Top Threats Today"
          enableArcLabels
          enableArcLinkLabels
          arcLabelsSkipAngle={15}
          arcLinkLabelsSkipAngle={15}
          className="card-metricui h-full flex-1"
        />

        <DonutChart
          data={data.top_active_groups_today}
          title="Top Active Groups of Today"
          enableArcLabels
          enableArcLinkLabels
          arcLabelsSkipAngle={15}
          arcLinkLabelsSkipAngle={15}
          className="card-metricui h-full flex-1"
        />

        <div className="lg:col-span-2" >
          <BarChart
            preset="horizontal"
            data={data.top_threats_week}
            categories={["count"]}
            index="threat_type"
            title="Top Threats of the Week"
            format={{ style: "number" }}
            className="card-metricui h-full flex-1"
          />
        </div>
      </div>
    </>
  )
}

function LastDate({ apiData }) {
  const date = apiData.read();

  const formattedDate = new Date(date.updated).toLocaleString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <p className="text-white/40 text-xs">
      Updated: {formattedDate} UTC
    </p>
  );
}

export default function DashboardPage() {
  const apiData = fetchData(endpoints.summary)

  return (
    <TerminalKitty path="~/Dashboard"
      headerContent={
        <Suspense>
          <LastDate apiData={apiData}/>
        </Suspense>
    }>
      <div className="min-h-screen p-4">
        <Suspense fallback={
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <KpiCard loading className="card-metricui"/>
              <KpiCard loading className="card-metricui"/>
              <KpiCard loading className="card-metricui"/>
              <KpiCard loading className="card-metricui"/>
            </div>
            <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-4">
                <LineChart data={[]} title="Users" loading className="card-metricui"/>
              </div>
              <div className="lg:col-span-2">
                <LineChart data={[]} title="Users" loading className="card-metricui"/>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4">
              <DonutChart data={[]} loading className="card-metricui"/>
              <DonutChart data={[]} loading className="card-metricui"/>
              <div className="lg:col-span-2" >
                <BarChart data={[]} categories={["revenue"]} index="month" loading className="card-metricui"/>
              </div>
            </div>
          </>
        }>
          <DashboardContent apiData={apiData} />
        </Suspense>
      </div>
    </TerminalKitty>
  )
}