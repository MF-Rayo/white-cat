import { Suspense, useMemo } from "react"
import { ResponsiveContainer } from "recharts"

import Container from "@/components/Container"
import { Panel } from "@/components/ui/panel";
import { DataBarChart }  from "@/components/ui/chart";

import { KpiCard, AreaChart, LineChart, DonutChart, DataTable, BarChart, 
  MetricProvider, Choropleth, worldFeatures, Badge} from "metricui";

import { DashboardSummaryProvider, useDashboardSummary } from "@/context/DashboardContext";

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
    <DataTable
      title="Today's Cybersecurity News"
      data={dataTable}
      columns={columns}
      pageSize={5}
      onRowClick={handleRowClick}
      className="card-metricui h-full overflow-hidden"
    />
  );
}

function DashboardContent({ apiData }) {
  const data = apiData;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-(--gp)">
        <KpiCard
          title="Today's IOC"
          value={data.threat.today}
          format="number"
          comparison={{ value: data.threat.yesterday }}
          comparisonLabel="vs yesterday"
          sparkline={{
            data: data.threat.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="IOC Of The Week"
          value={data.threat.week}
          format="number"
          comparison={{ value: data.threat.last_week }}
          comparisonLabel="vs last week"
          sparkline={{
            data: data.threat.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Today's IOC Sources"
          value={data.sources.today}
          format="number"
          comparison={{ value: data.sources.yesterday }}
          comparisonLabel="vs yesterday"
          sparkline={{
            data: data.sources.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Today's Active Group Posts"
          value={data.groups.posts}
          format="number"
          comparison={{ value: data.groups.posts_yesterday }}
          comparisonLabel="vs yesterday"
          sparkline={{
            data: data.groups.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
      </div>

      <div className="pt-(--pd) grid grid-cols-1 lg:grid-cols-6 gap-(--gp)">
        <div className="lg:col-span-4">
          <AreaChart
            data={data.threat.chart}
            title="IOC Of The Week"
            format={{ style: "number" }}
            curve="monotoneX"
            className="card-metricui"
          />
        </div>
        <div className="lg:col-span-2">
          <DonutChart
            data={data.tops.threat}
            title="Top IOC Today"
            enableArcLabels
            enableArcLinkLabels
            arcLabelsSkipAngle={15}
            arcLinkLabelsSkipAngle={15}
            className="card-metricui"
            legend={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) pt-(--pd) items-stretch">
    
        <Choropleth
          data={data.tops.source}
          features={worldFeatures}
          idField="iso"
          valueField="reports"
          title="IOC Map"
          scaleType="log"
          tooltipLabel="Population"
          legend={false}
          projectionType="naturalEarth1"
          projectionScale={100}
          borderWidth={0.5}
          className="card-metricui"
          colors={[
            "#6366f1",
            "#10b981",
            "#f59e0b",
            "#84cc16",
            "#ef4444",
            "#ec4899",
            "#f97316",
            "#06b6d4",
            "#8b5cf6"
          ]}
        />
        
        <DataTable
          data={data.tops.source}
          className="card-metricui"
        />

        <DonutChart
          data={data.groups.today}
          centerValue={data.groups.posts}
          centerLabel="Total"
          title="Today's Active Group Posts"
          enableArcLabels
          enableArcLinkLabels
          arcLabelsSkipAngle={15}
          arcLinkLabelsSkipAngle={15}
          className="card-metricui h-full"
          legend={true}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd) items-stretch" >
        <div className="lg:col-span-2">
          <DataBarChart groupsData={data?.groups?.week} 
            title="Active Group Posts of the Week" preset="horizontal"/>
        </div>
        <div className="lg:col-span-4">
          <TableNew dataTable={data.news}/>
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
      <Badge variant="success" dot>Updated</Badge>
      <span className="text-[10px] font-bold tracking-wider text-slate-400">
        UTC {utcFormatted} / Local {localFormatted}
      </span>
    </div>
  );
}


function DashboardSkeleton() {
  return(
    <>
    <Container path="~/Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-(--gp)">
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCard key={index} loading className="card-metricui" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd)">
        <div className="lg:col-span-4">
          <LineChart data={[]} title="IOC Of The Week" loading className="card-metricui"/>
        </div>
        <div className="lg:col-span-2">
          <DonutChart data={[]} title="Top IOC Today" loading className="card-metricui"/>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) pt-(--pd)">
        <DonutChart data={[]} loading className="card-metricui"/>
        <DonutChart data={[]} loading className="card-metricui"/>
        <DonutChart data={[]} loading className="card-metricui"/>
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
      <MetricProvider exportable>
        <DashboardContent apiData={apiData} />
      </MetricProvider>
    </Container>
  );
}