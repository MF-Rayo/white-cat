import TerminalKitty from "@/components/ui/kitty"

function DisclaimerBlock({ command, title, sections, lang }) {
  return (
    <div className="p-4 font-mono text-sm text-(--text-color)">
      <p className="text-(--primary-color) mb-2">$ {command}</p>
      <p className="font-bold mb-3 text-(--text-secondary)">{title}</p>
      <div className="space-y-3">
        {sections.map((s, i) => (
          <p key={i} className="text-(--text-secondary) leading-relaxed">
            <strong className="text-(--text-secondary)">{s.heading}:</strong> {s.body}
          </p>
        ))}
      </div>
    </div>
  )
}

const sectionsEn = [
  {
    heading: "Project Purpose",
    body: "This platform was built as a personal software engineering project to practice full-stack development — React and Tailwind CSS on the frontend, FastAPI on the backend. It is not a commercial product, and no data, service, or subscription is sold through this site.",
  },
  {
    heading: "Data Sources & Attribution",
    body: "News articles, threat indicators, and related metrics are retrieved in real time from public third-party APIs and cybersecurity feeds. All trademarks, logos, and original content remain the property of their respective owners. This platform functions strictly as an aggregator, crediting each source and linking back to the original publication.",
  },
  {
    heading: "No Warranty",
    body: "Content is displayed \"as is\" for informational purposes. While every effort is made to relay data accurately, no guarantee is made regarding its completeness, timeliness, or correctness. Decisions made based on this information are the sole responsibility of the reader.",
  },
]

export default function Fetch() {
  return (
    <TerminalKitty path="~/Disclaimer" headerContent={null}>
      <DisclaimerBlock
        command="cat disclaimer_en.md"
        title="Legal, Educational Notice & Disclaimer"
        sections={sectionsEn}
        lang="en"
      />
    </TerminalKitty>
  )
}