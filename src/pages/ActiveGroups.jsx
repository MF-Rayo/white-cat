import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchData } from "@/lib/fetchData"
import { endpoints } from "@/lib/api"
import { DataBarChart }  from "@/components/ui/chart";
import { Panel } from "@/components/ui/panel";
import { Card } from "@/components/ui/card"
import Container from "@/components/Container"

import { DrillDown, DropdownFilter, KpiCard,  BarChart,
  MetricProvider, DashboardNav, DataTable } from "metricui"


function ActiveGroupsList({ apiData }) {
  const data = apiData.read();
  const [activeTab, setActiveTab] = useState("today");

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-(--gp)">
        <KpiCard
          title="Group activity this year"
          value={data.ransom_look.stats.posts_year}
          format="number"
          className="card-metricui"
        />
        <KpiCard
          title="Active Groups Today"
          value={data.ransom_look.today.unique_groups}
          format="number"
          className="card-metricui"
        />
        <KpiCard
          title="Active Group Posts Today"
          value={data.ransom_look.today.total_reports}
          format="number"
          sparkline={{
            data: data.ransom_look.last_7_days.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Active Group Posts This Week"
          value={data.ransom_look.last_7_days.total_reports}
          format="number"
          sparkline={{
            data: data.ransom_look.last_7_days.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Active Group Posts This Month"
          value={data.ransom_look.last_30_days.total_reports}
          format="number"
          sparkline={{
            data: data.ransom_look.last_30_days.sparkline,
            type: "line",
            interactive: true,
          }}
          className="card-metricui"
        />
        <KpiCard
          title="Active Group Posts Last 3 Months"
          value={data.ransom_look.last_90_days.total_reports}
          format="number"
          sparkline={{
            data: data.ransom_look.last_90_days.sparkline,
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) h-[auto] lg:h-[60vh]">
  
              <Panel title="Posts Reported" className="h-[450px] lg:h-full overflow-hidden">
                <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-(--pd) pr-2">
                  <div className="grid grid-cols-1 gap-(--gp)">
                    {data?.ransomware_live?.map((item) => (
                      <Card
                        key={item.post_url || item.victim}
                        source={`Source: ${item.source}`}
                        activity={item.activity}
                        post_url={item.post_url}
                        discovered={item.discovered}
                        group_name={item.group_name}
                        victim={item.victim}
                        description={item.description}
                      />
                    ))}
                  </div>
                </div>
              </Panel>

              <MetricProvider theme="" exportable>
                <DrillDown.Root className="h-full">
                  <BarChart
                    data={data?.ransom_look?.today?.groups ?? []}
                    index="group"
                    title="Today"
                    categories={["reports"]}
                    drillDown
                    tooltipHint
                    className="card-metricui h-full"
                  />
                </DrillDown.Root>
              </MetricProvider>

              <div className="h-full">
                <DataBarChart
                  groupsData={data?.ransom_look?.last_7_days?.groups}
                  title="Week"
                />
              </div>
            </div>
          )}

          {activeTab === "one_month" && (
            <div className="h-[60vh] w-full">
              <DataBarChart
                groupsData={data?.ransom_look?.last_30_days?.groups}
              />
            </div>
          )}

          {activeTab === "three_months" && (
            <div className="h-[60vh] w-full">
              <DataBarChart
                groupsData={data?.ransom_look?.last_90_days?.groups}
              />
            </div>
          )}
        </div>
      </div>
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