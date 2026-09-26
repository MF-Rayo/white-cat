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
      body: "IOC reports, active ransomware groups, and victim logs are ingested approximately every 40 minutes from public sources like ThreatFox, Ransomware.live, and Ransomware Look. Raw feeds are normalized and processed for dashboard visualization.",
    },
    {
      title: "News Aggregation & Attribution",
      badge: "Headlines",
      body: "Daily headlines are indexed directly from RSS/APIs of security outlets including The Hacker News, BleepingComputer, and The Record. Only titles and direct links are fetched to route users to the original publisher.",
    },
    {
      title: "No Warranty & Ownership",
      badge: "Legal",
      body: "All trademarks, logos, and original intellectual property belong to their respective creators. Information is provided 'as is' for research purposes, without guarantees regarding completeness or real-time accuracy.",
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
      body: "Los reportes de IOCs, grupos de ransomware activos y publicaciones de víctimas se obtienen cada 40 minutos aproximadamente desde ThreatFox, Ransomware.live y Ransomware Look, procesando la información para su renderizado analítico.",
    },
    {
      title: "Agregación de Noticias",
      badge: "Titulares",
      body: "Se extraen únicamente los titulares del día y enlaces directos hacia las fuentes originales como The Hacker News, BleepingComputer y The Record, funcionando estrictamente como un canal de redirección a los medios oficiales.",
    },
    {
      title: "Atribución y Exención",
      badge: "Aviso Legal",
      body: "Todas las marcas registradas, logotipos y contenido original pertenecen a sus respectivos dueños. La información se presenta 'tal cual' con fines de investigación, sin garantía implícita de precisión en tiempo real.",
    },
  ],
};

export default function DisclaimerBlock() {
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
      <div className="p-4 md:p-6 bg-(--bg-color) h-full border border-(--border-color) rounder-[var(--rounder)]">
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