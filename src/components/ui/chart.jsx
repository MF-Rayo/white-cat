import React from "react";
import { DrillDown,  KpiCard, MetricProvider, 
  DataTable, BarChart } from "metricui";

function aggregateByDate(groups) {
  const totals = {};
  for (const g of groups) {
    const date = g.last_post.slice(0, 10);
    totals[date] = (totals[date] || 0) + g.reports;
  }
  return Object.entries(totals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, reports]) => ({ date, reports }));
}

function groupRecordsByDate(groups) {
  return groups.reduce((acc, g) => {
    const date = g.last_post.slice(0, 10);
    (acc[date] ??= []).push(g);
    return acc;
  }, {});
}

export function DataBarChart({ groupsData = [], title = " ", preset = "vertical" }) {
  const chartData = aggregateByDate(groupsData);
  const recordsByDate = groupRecordsByDate(groupsData);

  return (
    <MetricProvider exportable>
      <DrillDown.Root>
        <BarChart
          data={chartData}
          index="date"
          title={title}
          preset={preset}
          categories={["reports"]}
          tooltipHint
          className="card-metricui"
          drillDown={({ indexValue }) => {
            const records = recordsByDate[indexValue] ?? [];
            const totalReports = records.reduce((sum, r) => sum + r.reports, 0);

            return (
              <div>
                <div className="gap-(--gap) py-(--pd)">
                  <KpiCard
                    title="RECORDS"
                    value={records.length}
                    format="number"
                    className="card-metricui"
                  />
                  <KpiCard
                    title="TOTAL REPORTS"
                    value={totalReports}
                    format="number"
                    className="card-metricui"
                  />
                </div>

                <DataTable
                  className="card-metricui"
                  title={indexValue}
                  data={records.map((r) => ({
                    group: r.group,
                    reports: r.reports,
                    last_post: r.last_post.slice(0, 10),
                  }))}
                  columns={[
                    { key: "group", label: "Group" },
                    { key: "reports", label: "Reports" },
                    { key: "last_post", label: "Last Post" },
                  ]}
                  searchable
                />
              </div>
            );
          }}
        />
      </DrillDown.Root>
    </MetricProvider>
  );
}