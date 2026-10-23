import { useState } from "react";
import { DashboardNav } from "metricui";
import Container from "@/components/Container";

const disclaimerData = {
  english: [
    {
      title: "Project Purpose",
      badge: "Educational",
      body: "This platform is a personal, self-taught project developed to advance full-stack engineering skills (React, Tailwind CSS, and FastAPI). It operates non-commercially; no data, subscriptions, or services are sold.",
    },
    {
      title: "Threat Intelligence Feeds",
      badge: "CTI Pipeline",
      body: "IOC data is retrieved approximately every 40 minutes through the official ThreatFox API and stored in this project's database. Active ransomware groups and victim posts are obtained from Ransomware.live and Ransomware Look. Victim posts are claims made by the groups themselves and have not been independently verified.",
    },
    {
      title: "News Aggregation & Attribution",
      badge: "Headlines",
      body: "Headlines are collected approximately every 50 minutes from the public RSS feeds of outlets such as The Hacker News, BleepingComputer, and The Record. Only the title, source name, a brief description, and the link are kept, and this data is temporary: it is replaced on each refresh. Clicking an item sends you to the original article on the publisher's website.",
    },
    {
      title: "No Warranty & Ownership",
      badge: "Legal",
      body: "All trademarks, logos, and original content belong to their respective owners, and this project is not affiliated with any of the sources mentioned. Information is provided 'as is' for research purposes, without guarantees regarding completeness or real-time accuracy.",
    },
  ],
  spanish: [
    {
      title: "Propósito del Proyecto",
      badge: "Educativo",
      body: "Esta plataforma es un proyecto personal y autodidacta desarrollado para profundizar en el desarrollo full-stack (React, Tailwind CSS y FastAPI). Funciona de manera no comercial; no se vende ningún tipo de dato, servicio o suscripción.",
    },
    {
      title: "Fuentes de CTI e Indicadores",
      badge: "Pipeline CTI",
      body: "Los IOCs se obtienen aproximadamente cada 40 minutos mediante la API oficial de ThreatFox y se almacenan en la base de datos del proyecto. Los grupos de ransomware activos y las publicaciones de víctimas provienen de Ransomware.live y Ransomware Look. Las publicaciones de víctimas son afirmaciones de los propios grupos y no han sido verificadas de forma independiente.",
    },
    {
      title: "Agregación de Noticias",
      badge: "Titulares",
      body: "Los titulares se recopilan aproximadamente cada 50 minutos desde los RSS públicos de medios como The Hacker News, BleepingComputer y The Record. Solo se conserva el título, el nombre de la fuente, una breve descripción y el enlace, y estos datos son temporales: se reemplazan en cada actualización. Al hacer clic, se redirige a la noticia original en el sitio del medio.",
    },
    {
      title: "Atribución y Exención",
      badge: "Aviso Legal",
      body: "Todas las marcas registradas, logotipos y contenido original pertenecen a sus respectivos dueños, y este proyecto no está afiliado a ninguna de las fuentes mencionadas. La información se presenta 'tal cual' con fines de investigación, sin garantía de exactitud en tiempo real.",
    },
  ],
};

export default function DisclaimerPage() {
  const [activeTab, setActiveTab] = useState("english");

  return (
    <Container
      path="~/Disclaimer"
      headerContent={
        <DashboardNav
          tabs={[
            { value: "english", label: "English" },
            { value: "spanish", label: "Spanish" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      }
    >
      <div className="p-4 md:p-6 h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {disclaimerData[activeTab].map((item, index) => (
            <div
              key={index}
              className="card-metricui p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-sm text-neutral-100">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}