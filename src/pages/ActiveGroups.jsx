import { Suspense, useState } from "react"
import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { Panel } from "@/components/ui/panel";
import { TablePost } from "@/components/ui/table"
import Container from "@/components/Container"
import { DataBarChart }  from "@/components/ui/chart";

import { KpiCard,  BarChart, MetricProvider, 
  DashboardNav, DonutChart } from "metricui"


function ActiveGroupsList({ apiData }) {
  const data = apiData.read();
  const [activeTab, setActiveTab] = useState("today");

  return (
    <>
      <MetricProvider exportable>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-(--gp)">
        <KpiCard
          title="Group activity this year"
          value={data.summary.stats.posts_year}
          format="number"
          className="card-metricui"
        />
        <KpiCard
          title="Active Groups Today"
          value={data.summary.today.unique_groups}
          format="number"
          className="card-metricui"
        />
        <KpiCard
          title="Active Group Posts Today"
          value={data.summary.today.total_reports}
          format="number"
          sparkline={{
            data: data.summary.last_7_days.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Posts This Week"
          value={data.summary.last_7_days.total_reports}
          format="number"
          sparkline={{
            data: data.summary.last_7_days.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Posts This Month"
          value={data.summary.last_30_days.total_reports}
          format="number"
          sparkline={{
            data: data.summary.last_30_days.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Posts Last 3 Months"
          value={data.summary.last_90_days.total_reports}
          format="number"
          sparkline={{
            data: data.summary.last_90_days.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
      </div>
        
      <div className="grid grid-cols-1 pt-(--pd) gap-(--gp) w-full">
        <Panel title="Filter">
          <DashboardNav
            tabs={[
              { value: "today", label: "Today / Week" },
              { value: "one_month", label: "1 Month" },
              { value: "three_months", label: "3 Months" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </Panel>

        <div className="w-full">
          {activeTab === "today" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-(--gp)">
  
              <TablePost dataTable={data.posts}/>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-(--gp) h-[auto] lg:h-[60vh]">
                <DonutChart
                  data={data?.summary.today.groups}
                  centerValue={data.summary.today.groups.length}
                  centerLabel="Total Groups"
                  title="Today's Active Group Posts"
                  enableArcLabels
                  enableArcLinkLabels
                  arcLabelsSkipAngle={15}
                  arcLinkLabelsSkipAngle={15}
                  className="card-metricui h-full"
                  legend={true}
                />

                <div className="h-full">
                  <DataBarChart
                    groupsData={data?.summary?.last_7_days?.groups}
                    title="Active Group Posts of the Week"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "one_month" && (
            <div className="h-[60vh] w-full">
              <DataBarChart
                groupsData={data?.summary?.last_30_days?.groups}
                title="Active Group Posts of the Month"
              />
            </div>
          )}

          {activeTab === "three_months" && (
            <div className="h-[60vh] w-full">
              <DataBarChart
                groupsData={data?.summary?.last_90_days?.groups}
                title="Active Group Posts of the three Month"
              />
            </div>
          )}
        </div>
      </div>
      </MetricProvider>
    </>
  );
}

export default function ActiveGroups() {

  const apiData = fetchData(endpoints.activeGroups)

  return (
    <Container path="~/Active Groups">
      <div className="min-h-screen">
        <Suspense fallback={
          <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-(--gp)">
            {Array.from({ length: 6 }).map((_, index) => (
              <KpiCard key={index} loading className="card-metricui" />
            ))}
          </div>
          
          <div className="py-(--pd)">
            <Panel title="Filter">
              <DashboardNav
                tabs={[
                  { value: "today", label: "Today / Week" },
                  { value: "one_month", label: "1 Month" },
                  { value: "three_months", label: "3 Months" },
                ]}
              />
            </Panel>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) h-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <BarChart key={index} data={[]} loading className="card-metricui" />
            ))}
          </div>
          </>
        } key={apiData}>
          <ActiveGroupsList apiData={apiData}/>
        </Suspense>
      </div>
    </Container>
  )
}