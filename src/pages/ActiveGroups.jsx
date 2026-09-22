import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchData } from "@/lib/fetchData"
import { endpoints } from "@/lib/api"
import { DataBarChart }  from "@/components/ui/chart";
import { Panel } from "@/components/ui/panel";
import { CardImage, CardSkeleton, NoResults } from "@/components/ui/card"
import Container from "@/components/Container"

import { DrillDown, DropdownFilter, KpiCard,  BarChart,
  MetricProvider, DashboardNav, DataTable } from "metricui"


function ActiveGroupsList({ apiData }) {
  const data = apiData.read();
  const [activeTab, setActiveTab] = useState("one_month");
  const [activeTabToday, setActiveTabToday] = useState("today");

  return (
    <div className="p-(--pd)">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-(--gap)">
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
          title="Active Group Posts (Last 3 Months)"
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
        
      <div className="grid grid-cols-1 lg:grid-cols-6 py-(--pd) gap-(--gap)">
        <div className="lg:col-span-2 flex flex-col h-full">
          <Panel title="Filter">
            <DashboardNav
              tabs={[
                { value: "today", label: "Today" },
                { value: "week", label: "Week" }
              ]}
              value={activeTabToday}
              onChange={setActiveTabToday}
            />
          </Panel>
          {activeTabToday === "today" && (
            <MetricProvider theme="" exportable>
              <DrillDown.Root>
                <BarChart
                  data={data?.ransom_look?.today?.groups ?? []}
                  index="group"
                  categories={["reports"]}
                  drillDown
                  tooltipHint
                  className="card-metricui"
                />
              </DrillDown.Root>
            </MetricProvider>
          )}
          {activeTabToday === "week" && (
            <DataBarChart groupsData={data?.ransom_look?.last_7_days?.groups} />
          )}
        </div>
        
        <div className="lg:col-span-4 h-full">
          <Panel title="Posts Reported">
            <div className="max-h-[500px] overflow-y-auto p-(--pd)">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-(--gap)">
                {data?.ransomware_live?.map((item) => (
                  <CardImage
                    key={item.post_url}
                    title={`Group Name: ${item.group_name}`}
                    summary={item.description}
                    frontPage={item.screenshot}
                    source={`Source: ${item.source}`}
                    date={item.date}
                    url={item.post_url}
                  />
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </div>
      
      <Panel title="Filter">
        <DashboardNav
          tabs={[
            { value: "one_month", label: "1 Month" },
            { value: "three_months", label: "3 Months" }
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-(--gap)">
        {activeTab === "one_month" && (
          <DataBarChart groupsData={data?.ransom_look?.last_30_days?.groups} />
        )}

        {activeTab === "three_months" && (
          <DataBarChart groupsData={data?.ransom_look?.last_90_days?.groups} />
        )}
      </div>

    </div>
  );
}

export default function ActiveGroups() {

  const apiData = fetchData(endpoints.activeGroups)

  return (
    <Container path="~/Active Groups">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="p-(--pd)">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-(--gap)">
              {Array.from({ length: 6 }).map((_, index) => (
              <KpiCard loading className="card-metricui"/>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-6 py-(--pd) gap-(--gap)">
              <div className="lg:col-span-2 flex flex-col h-full">
                <Panel title="Filter" className="h-full">
                  <Skeleton className="h-full"/>
                </Panel>
              </div>
         
              <div className="lg:col-span-4 h-full">
                <Panel title="Posts Reported">
                  <div className="max-h-[500px] overflow-y-auto p-(--pd)">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-(--gap)">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <CardSkeleton key={index} />
                      ))}
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        } key={apiData}>
          <ActiveGroupsList apiData={apiData}/>
        </Suspense>
      </div>
    </Container>
  )
}