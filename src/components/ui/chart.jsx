import { useState } from "react"
import { CustomTooltip} from "@/components/ui/panel"
import { PieChart, Pie, Sector, Cell, Label, Tooltip } from "recharts"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid} from "recharts"

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
  const {cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill} = props

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

export function ChartPieActiveGroups({ value, title, item, className }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const chartData = value.map((g) => ({
    name: g[item],
    count: g.count,
  }))

  const total = chartData.reduce((sum, g) => sum + g.count, 0)

  if (chartData.length === 0) {
    return (
      <div className={className}>
        <div className="px-4 py-3">
          <h3 className="text-left text-xs text-(--text-secondary) font-bold">{title}</h3>
        </div>
        <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="px-4 py-3">
        <h3 className="text-left text-xs text-(--text-secondary) font-bold">{title}</h3>
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
                      Total
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


function colorByRank(index) {
  return COLORS[index % COLORS.length]
}

export function BarCharts({ dataChart }){

  const data = dataChart ?? []

  return(
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
    >
      <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" horizontal={false} />
      <XAxis
        type="number"
        tick={{ fill: COLORS.mid, fontSize: 10 }}
        axisLine={{ stroke: COLORS.border }}
        tickLine={false}
      />
      <YAxis
        type="category"
        dataKey="country"
        width={110}
        tick={{ fill: COLORS.mid, fontSize: 10 }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip content={<CustomTooltip />} cursor={false} />
      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
        {data.map((_, i) => (
          <Cell key={i} fill={colorByRank(i)} />
        ))}
      </Bar>
    </BarChart>
  )
}