import { Suspense, useMemo } from "react"
import Container from "@/components/Container"
import { DataBarChart }  from "@/components/ui/chart";
import { DashboardMap } from "@/components/ui/simpleMap";

import { KpiCard, AreaChart, LineChart, DonutChart, 
  DataTable, MetricProvider, Badge} from "metricui";

import { TableNew, TablePost } from "@/components/ui/table"
import { DashboardSummaryProvider, useDashboardSummary } from "@/context/DashboardContext";

function DashboardContent({ apiData }) {
  const data = apiData;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-(--gp)">
        <KpiCard
          title="Today's IOC"
          value={data.ioc.today}
          format="number"
          comparison={{ value: data.ioc.yesterday }}
          comparisonLabel="vs yesterday"
          sparkline={{
            data: data.ioc.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="IOC Of The Week"
          value={data.ioc.week}
          format="number"
          comparison={{ value: data.ioc.last_week }}
          comparisonLabel="vs last week"
          sparkline={{
            data: data.ioc.sparkline,
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
            data={data.ioc.chart}
            title="IOC Of The Week"
            format={{ style: "number" }}
            curve="natural"
            enablePoints={true}
            pointSize={8}
            pointColor={["var(--primary-color)"]}
            pointBorderColor={["var(--bg-color)"]}
            colors={["var(--primary-color)"]}
            className="card-metricui"
          />
        </div>
        <div className="lg:col-span-2">
          <DonutChart
            data={data.tops.threat}
            centerValue={data.tops.threat.length}
            centerLabel="Top IOC"
            title="Top IOC Today"
            enableArcLabels
            enableArcLinkLabels
            arcLabelsSkipAngle={15}
            arcLinkLabelsSkipAngle={15}
            className="card-metricui h-full"
            legend={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) pt-(--pd) items-stretch">
        <DashboardMap data={data}/>

        <DataTable
          data={data?.tops?.source?.map((item) => ({
            country: item.country,
            reports: item.count,
          }))}
          pageSize={6}
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
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-(--gp) pt-(--pd) items-stretch" >
        <TablePost dataTable={data.posts}/>
        <TableNew dataTable={data.news}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd) items-stretch" >
        <div className="lg:col-span-2">
          <DataBarChart groupsData={data?.groups?.week} 
            title="Active Group Posts of the Week" preset="horizontal"/>
        </div>
        <div className="lg:col-span-4">
          <DataBarChart groupsData={data?.groups?.month}
          title="Active Group Posts of the Month"/>
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