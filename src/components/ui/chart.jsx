import { useState } from "react"
import { PieChart, Pie, Sector, Cell, Label, Tooltip } from "recharts"

const COLORS = [
  "var(--bar_a)",
  "var(--bar_b)",
  "var(--bar_c)",
  "var(--bar_d)",
  "var(--bar_e)",
  "var(--bar_f)",
  "var(--bar_g)",
  "var(--bar_h)",
  "var(--bar_i)",
  "var(--bar_j)",
]

function renderActiveShape(props) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  )
}

export function ChartPieActiveGroups({ value, className }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const chartData = value.map((g) => ({
    name: g.threat_type,
    count: g.count,
  }))

  const total = chartData.reduce((sum, g) => sum + g.count, 0)

  if (chartData.length === 0) {
    return (
      <div className={className}>
        <div className="border-b px-4">
          <h3 className="font-semibold">Threat</h3>
        </div>
        <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
          No hay grupos activos reportados hoy
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="px-4 py-3">
        <h3 className="text-left text-xs text-(--text-secondary) font-bold">Threat</h3>
      </div>
      <div className="flex justify-center pt-4">
        <PieChart width={280} height={280}>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            <Label
              content={({ viewBox }) => {
                const { cx, cy } = viewBox
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={cx} y={cy - 6} fill="var(--text-color)" className="text-2xl font-bold">
                      {total}
                    </tspan>
                    <tspan x={cx} y={cy + 14} fill="var(--text-secondary)" className="text-xs">
                      Threat
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--border-color, #374151)',
              borderRadius: '8px',
              color: 'var(--text-color, #fff)'
            }}
          />
        </PieChart>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 pb-4 text-xs">
        {chartData.map((g, i) => (
          <div key={g.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span>{g.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}