import { Suspense, useMemo, useState } from "react"
import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { Panel } from "@/components/ui/panel"
import { TablePost } from "@/components/ui/table"
import Container from "@/components/Container"

import {
  KpiCard, DonutChart, DataTable,
  MetricProvider, DashboardNav,
} from "metricui"

const sum = (a = []) => a.reduce((t, v) => t + v, 0)

function ActiveGroupsList({ apiData }) {
  const data = apiData.read()
  const [activeTab, setActiveTab] = useState("today")
  const { summary } = data

  const s7 = summary.last_7_days.sparkline
  const s30 = summary.last_30_days.sparkline
  const s90 = summary.last_90_days.sparkline

  const yesterday = s7.at(-2)
  const prev7 = sum(s30.slice(-14, -7))   
  const prev30 = sum(s90.slice(-60, -30)) 

  const tabs = {
    today: {
      title: "Today's Active Group Posts",
      groups: summary.today.groups,
      total: summary.today.total_reports,
    },
    week: {
      title: "Active Group Posts This Week",
      groups: summary.last_7_days.groups,
      total: summary.last_7_days.total_reports,
    },
    one_month: {
      title: "Active Group Posts This Month",
      groups: summary.last_30_days.groups,
      total: summary.last_30_days.total_reports,
    },
    three_months: {
      title: "Active Group Posts, Last 3 Months",
      groups: summary.last_90_days.groups,
      total: summary.last_90_days.total_reports,
    },
  }

  const { title, groups, total } = tabs[activeTab]

  const topGroups = [...groups]
    .sort((a, b) => b.reports - a.reports)
    .slice(0, 10)

  const donut = topGroups.map((g) => ({
    id: g.group,
    label: g.group,
    value: g.count,
  }))

  const tableRows = groups.map((g) => ({...g}))

  return (
    <MetricProvider exportable>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-(--gp) pb-(--pd)">
        <KpiCard
          title="Posts today"
          value={summary.today.total_reports}
          format="number"
          comparison={{ value: yesterday }}
          comparisonLabel="vs yesterday"
          sparkline={{ data: s7, type: "line" }}
          className="card-metricui"
        />
        <KpiCard
          title="Posts this week"
          value={summary.last_7_days.total_reports}
          format="number"
          comparison={{ value: prev7 }}
          comparisonLabel="vs previous 7 days"
          sparkline={{ data: s7, type: "line", interactive: true }}
          className="card-metricui"
        />
        <KpiCard
          title="Posts this month"
          value={summary.last_30_days.total_reports}
          format="number"
          comparison={{ value: prev30 }}
          comparisonLabel="vs previous 30 days"
          sparkline={{ data: s30, type: "line", interactive: true }}
          className="card-metricui"
        />
        <KpiCard
          title="Posts last 3 months"
          value={summary.last_90_days.total_reports}
          format="number"
          sparkline={{ data: s90, type: "line", interactive: true }}
          className="card-metricui"
        />
        <KpiCard
          title="Posts this year"
          value={summary.stats.posts_year}
          format="number"
          className="card-metricui"
        />
      </div>

      <div className="grid grid-cols-1 gap-(--gp) w-full">
        <Panel title="Filter">
          <DashboardNav
            tabs={[
              { value: "today", label: "Today" },
              { value: "week", label: "Week" },
              { value: "one_month", label: "1 Month" },
              { value: "three_months", label: "3 Months" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp)">
          <DonutChart
            title="Top 10 groups"
            data={donut}
            format="number"
            centerValue={String(total)}
            centerLabel="Posts"
            enableArcLabels
            enableArcLinkLabels
            legend={false}
            className="card-metricui"
          />
          <div className="lg:col-span-2">
            <DataTable
              data={tableRows}
              title={title}
              pageSize={5}
              searchable
              className="card-metricui"
            />
          </div>
        </div>

        {activeTab === "today" && <TablePost dataTable={data.posts} />}
      </div>
    </MetricProvider>
  )
}

export default function ActiveGroups() {
 
  // useMemo evita crear una promesa nueva en cada render
  const apiData = useMemo(() => fetchData(endpoints.activeGroups), [])

  return (
    <Container path="~/Active Groups">
      <div className="min-h-screen">
        <Suspense
          fallback={
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-(--gp) pb-(--pd)">
                {Array.from({ length: 5 }).map((_, i) => (
                  <KpiCard key={i} loading className="card-metricui" />
                ))}
              </div>
             
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp)">
                <DonutChart data={[]} loading className="card-metricui" />
                <div className="lg:col-span-2">
                  <DataTable data={[]} loading className="card-metricui" />
                </div>
              </div>
            </>
          }
        >
          <ActiveGroupsList apiData={apiData} />
        </Suspense>
      </div>
    </Container>
  )
}