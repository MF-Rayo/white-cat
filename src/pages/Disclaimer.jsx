import TerminalKitty from "@/components/ui/kitty"

const sectionsEn = [
  {
    heading: "Project Purpose",
    body: "This platform is a self-taught, personal project built to learn full-stack development on my own — React and Tailwind CSS on the frontend, FastAPI on the backend. It is not a commercial product, and no data, service, or subscription is sold through this site.",
  },
  {
    heading: "Data Sources & Attribution",
    body: "News articles, threat indicators, and related metrics are retrieved in real time from established, publicly available cybersecurity feeds and APIs. All trademarks, logos, and original content remain the property of their respective owners. This platform functions strictly as an aggregator, crediting each source and linking back to the original publication.",
  },
  {
    heading: "No Warranty",
    body: "Content is displayed \"as is\" for informational purposes. While the underlying sources are reputable, no guarantee is made regarding the completeness, timeliness, or correctness of the data shown. Decisions made based on this information are the sole responsibility of the reader.",
  },
]

const sectionsEs = [
  {
    heading: "Propósito del Proyecto",
    body: "Esta plataforma es un proyecto personal y autodidacta desarrollado para aprender desarrollo full-stack: React y Tailwind CSS en el frontend, y FastAPI en el backend. No es un producto comercial y no se vende ningún tipo de dato, servicio o suscripción a través de este sitio.",
  },
  {
    heading: "Fuentes de Datos y Atribución",
    body: "Las noticias, indicadores de amenazas y métricas relacionadas se obtienen en tiempo real a partir de fuentes de ciberseguridad y APIs públicas y consolidadas. Todas las marcas registradas, logotipos y contenido original son propiedad de sus respectivos dueños. Esta plataforma funciona estrictamente como un agregador, dando crédito a cada fuente y enlazando a la publicación original.",
  },
  {
    heading: "Sin Garantía",
    body: "El contenido se muestra \"tal cual\" con fines informativos. Si bien las fuentes utilizadas son reconocidas, no se garantiza la exhaustividad, puntualidad o exactitud de los datos presentados. Las decisiones tomadas con base en esta información son responsabilidad exclusiva del lector.",
  },
]

export default function DisclaimerBlock() {
  return (
    <TerminalKitty path="~/Disclaimer" headerContent={null}>
      
      <div className="p-4 m-4 font-mono text-sm text-(--text-color)">
        <div className="mb-1 text-xs pb-2 select-none">
          <span className="text-(--primary-color) text-sm font-bold">$whitecat@debian: </span>
          <span className="text-(--text-color) text-sm">cat disclaimer_en.md</span>
        </div>
        <p className="font-bold mb-3 text-(--text-secondary)">Legal, Educational Notice & Disclaimer</p>
        <div className="space-y-3">
          {sectionsEn.map((s, i) => (
            <p key={i} className="text-(--text-secondary) leading-relaxed">
              <strong className="text-(--text-secondary)">{s.heading}:</strong> {s.body}
            </p>
          ))}
        </div>
        <div className="mt-4 text-xs pb-2 select-none">
          <span className="text-(--primary-color) text-sm font-bold">$whitecat@debian: </span>
          <span className="text-(--text-color) text-sm">cat disclaimer_es.md</span>
        </div>
        <p className="font-bold mb-3 text-(--text-secondary)">Legal, Educational Notice & Disclaimer</p>
        <div className="space-y-3">
          {sectionsEs.map((s, i) => (
            <p key={i} className="text-(--text-secondary) leading-relaxed">
              <strong className="text-(--text-secondary)">{s.heading}:</strong> {s.body}
            </p>
          ))}
        </div>
      </div>

    </TerminalKitty>
  )
}