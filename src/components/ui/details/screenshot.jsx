import { useState } from "react";
import { Badge } from "metricui";
import { CopyData } from "@/components/ui/clipboard/CopyData"
import { FormatDate } from "@/components/ui/date/FormatDate"
import { ExternalLink, ImageOff, Server, Globe, 
  DatabaseSearch, CalendarClock, Bug} from "lucide-react";

const formatText = (v = "") => v.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const statusVariant = (code) => {
  if (code >= 500) return "danger";
  if (code >= 400) return "warning";
  if (code >= 300) return "info";
  if (code >= 200) return "success";
  return "default";
};

function Section({ icon: Icon, title, children }) {
  return (
    <section className="space-y-2">
      <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-(--text-secondary)">
        <Icon size={12} />
        {title}
      </h4>
      {children}
    </section>
  );
}

function Field({ label, children, mono = false }) {
  if (children === undefined || children === null || children === "") return null;
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider opacity-60">{label}</dt>
      <dd className={`truncate text-xs text-(--text-color) ${mono ? "font-mono" : ""}`} title={String(children)}>
        {children}
      </dd>
    </div>
  );
}

function Screenshot({ src, href, title }) {
  const [state, setState] = useState(src ? "loading" : "error");

  const content = (
    <div className="group relative h-[20vh] lg:h-[40vh] overflow-hidden rounded-(--radius-card) border border-(--border-color) bg-(--bg-color)">
      {state === "loading" && <div className="bg-(--border-color)" />}
      {state === "error" ? (
        <div className="flex h-full flex-col items-center justify-center gap-1 text-[11px] text-(--text-secondary)">
          <ImageOff size={18} />
          Screenshot not available
        </div>
      ) : (
        <img
          src={src}
          alt={title ? `Screenshot of ${title}` : "Page screenshot"}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setState("ok")}
          onError={() => setState("error")}
          className={`h-full w-full object-cover object-top transition duration-300 group-hover:scale-105 ${
            state === "ok" ? "opacity-90 group-hover:opacity-100" : "opacity-0"
          }`}
        />
      )}
      {href && state === "ok" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
          Open in urlscan <ExternalLink size={10} />
        </div>
      )}
    </div>
  );

  return href && state === "ok" ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}

export function IocDetails({ data }) {
  const {
    ioc, tags, ioc_type, threat_type, reporter, confidence_level, reference,
    screenshot, scan_date, report, http_status, title, ip, asn, asn_name, server,
  } = data;

  const tagList = Array.isArray(tags) ? tags : (tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const hasNetwork = ip || asn || server;
  const confidence = Number(confidence_level);

  return (
    <div className="grid gap-4 p-3 text-xs text-(--text-secondary) lg:grid-cols-5">
   
      <div className="space-y-2 lg:col-span-2">
        <Screenshot src={screenshot} href={report} title={title} />
        {(title || http_status) && (
          <div className="flex items-start justify-between gap-2">
            {title && (
              <p className="line-clamp-2 min-w-0 text-[11px] leading-snug text-(--text-color)" title={title}>
                {title}
              </p>
            )}
            {http_status && (
              <Badge variant={statusVariant(http_status)} className="shrink-0">
                HTTP {http_status}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 lg:col-span-3">
        <Section icon={Bug} title="IOC">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
            <Field label={ioc_type}>{ioc}</Field>
            <Field label="Copy To Clipboard">
              <CopyData data={ioc}/>
            </Field>
          </dl>
        </Section>

        <Section icon={Globe} title="Threat">
          <div className="flex flex-wrap gap-x-1.5 gap-y-2 pb-2">
            {tagList.map((t) => (
              <Badge key={t} variant="danger">{t}</Badge>
            ))}
            {threat_type && <Badge variant="warning">{formatText(threat_type)}</Badge>}
            {ioc_type && <Badge variant="default">{ioc_type}</Badge>}
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
            <Field label="Reported by">{reporter}</Field>
            <Field label="Confidence Level">{confidence}%</Field>
          </dl>
        </Section>

        {hasNetwork && (
          <Section icon={Server} title="Network">
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
              <Field label="IP">{ip}</Field>
              <Field label="Server">{server}</Field>
              <div className="col-span-2">
                <Field label="ASN">{[asn, asn_name].filter(Boolean).join(" · ")}</Field>
              </div>
            </dl>
          </Section>
        )}
        {scan_date && (
          <Section icon={CalendarClock} title="Scanned">
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
               <FormatDate date={scan_date}/>
            </dl>
          </Section>
        )}

        {reference && (
          <Section icon={DatabaseSearch} title="References">
            <div className="flex flex-col gap-1">
              {reference && (
                <a
                  href={reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={reference}
                  className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-(--primary-color)"
                >
                  <ExternalLink size={12} className="shrink-0" />
                  <span className="truncate font-mono text-[11px]">{reference}</span>
                </a>
              )}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}