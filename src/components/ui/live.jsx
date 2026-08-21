export function LiveData({ data, className }) {
  
  const items = []

  data.top_threats.forEach((t) => {
    items.push({ label: "Threat Reported", name: t.threat_type, count: t.count, color: "var(--warning-color)" })
  })

  data.top_countries.forEach((c) => {
    items.push({ label: "Country Reported", name: c.country, count: c.count, color: "var(--info-color)" })
  })

  data.top_activegroups.forEach((g) => {
    items.push({ label: "ActiveGroup Reported", name: g.group_name, count: g.count, color: "var(--danger-color)" })
  })

  if (items.length === 0) return null

  const loopItems = [...items, ...items]

  return (
    <div className={`relative ml-auto flex items-center overflow-hidden rounded-lg bg-transparent ${className}`}>
      <div className="flex max-w-[400px] overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pl-6">
          {loopItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-(--text-color)">{item.label}:</span>
              <span className="font-medium text-(--text-secondary)">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
      `}</style>
    </div>
  )
}