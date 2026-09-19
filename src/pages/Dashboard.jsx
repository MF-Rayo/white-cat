import { Suspense, useMemo } from "react"
import { ResponsiveContainer } from "recharts"
import { Panel } from "@/components/ui/panel";
import Container from "@/components/Container"

import { SimpleMap } from "@/components/ui/map"
import { KpiCard, AreaChart, LineChart, DonutChart, BarChart, DataTable } from "metricui";

import { DashboardSummaryProvider, useDashboardSummary } from "@/context/DashboardContext";

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


function TableNew({ dataTable }) {
  const columns = useMemo(
    () => [
      { key: "title", header: "Title", type: "text" },
      { key: "source", header: "Source", type: "text" },
      { key: "date", header: "Date", type: "text" },
    ],
    []
  );

  const handleRowClick = (row) => {
    if (row?.source_of_information) {
      window.open(row.source_of_information, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="lg:col-span-8">
      <DataTable
        data={dataTable}
        columns={columns}
        title="Today's Cybersecurity News"
        pageSize={10}
        searchable
        onRowClick={handleRowClick}
        className="card-metricui w-full overflow-hidden cursor-pointer"
      />
    </div>
  );
}


function DashboardContent({ apiData }) {
  const data = apiData;
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-(--gap)">

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

      <div className="pt-(--pd) grid grid-cols-1 lg:grid-cols-6 gap-(--gap)">

        <div className="lg:col-span-4">
          <AreaChart
            data={sparklineToAreaChartData(data.threat_week_sparkline, "Threat")}
            title="Threats Of The Week"
            format={{ style: "number" }}
            className="card-metricui"
          />
        </div>
       
        <Panel title="The 10 sources of reported threats" 
          className="lg:col-span-2 lg:h-full
          font-medium overflow-hidden h-[300px]">
          <SimpleMap data={data.top_countries_today}></SimpleMap>
        </Panel>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-(--gap) pt-(--pd) items-stretch">
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
            className="card-metricui h-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-(--gap) pt-(--pd) items-stretch">
        <div className="lg:col-span-2" >
          <TableNew dataTable={data.cyber_news_today}/>
        </div>
      </div>
    </>
  )
}

function LastDate({ apiData }) {
  const dateObj = useMemo(() => {
    if (!apiData?.updated) return null;
    return new Date(apiData.updated);
  }, [apiData?.updated]);

  if (!dateObj || isNaN(dateObj.getTime())) {
    return null;
  }

  const utcFormatted = dateObj.toLocaleString("en-US", {
    timeZone: "UTC",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const localFormatted = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="absolute top-3 right-3 flex items-center gap-2 px-2 py-1">    
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--primary-color) opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-(--primary-color)" />
      </span>

      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
        Updated: UTC {utcFormatted} / Local {localFormatted}
      </span>
    </div>
  );
}


function DashboardSkeleton() {
  return(
    <>
    <Container path="~/Dashboard">
      <div className="min-h-screen p-(--pd)">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-(--gap)">
          <KpiCard loading className="card-metricui"/>
          <KpiCard loading className="card-metricui"/>
          <KpiCard loading className="card-metricui"/>
          <KpiCard loading className="card-metricui"/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gap) pt-(--pd)">
          <div className="lg:col-span-4">
            <LineChart data={[]} title="Users" loading className="card-metricui"/>
          </div>
          <div className="lg:col-span-2">
            <LineChart data={[]} title="Users" loading className="card-metricui"/>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-(--gap) pt-(--pd)">
          <DonutChart data={[]} loading className="card-metricui"/>
          <DonutChart data={[]} loading className="card-metricui"/>
          <div className="lg:col-span-2" >
            <BarChart data={[]} categories={["revenue"]} index="month" loading className="card-metricui"/>
          </div>
        </div>
      </div>
    </Container>
    </>
  )
}



export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardSummaryProvider>
        <DashboardInner />
      </DashboardSummaryProvider>
    </Suspense>
  );
}


function DashboardInner() {
  const apiData = useDashboardSummary();

  return (
    <Container path="~/Dashboard" headerContent={<LastDate apiData={apiData} />}>
      <div className="min-h-screen p-(--pd)">
        <DashboardContent apiData={apiData} />
      </div>
    </Container>
  );
}