import { useMemo } from "react";
import { DataTable, MetricProvider, Badge } from "metricui"; 
import { hashToColor }  from "@/lib/hashColor"
import { formatDate, formatHour } from "@/lib/formatDate";

function IocDetails({ data }) {
  return(
    <div className="grid grid-cols-1 gap-4 p-2 text-xs md:grid-cols-3">
      <div className="space-y-2 md:col-span-2 text-(--text-secondary)">
        <p><strong className="text-(--text-color)" >Tag:</strong> {data.tags}</p>
        <p><strong className="text-(--text-color)" >IOC Type:</strong> {data.ioc_type}</p>
        <p><strong className="text-(--text-color)" >Threat Type:</strong> {data.threat_type}</p>
        <p><strong className="text-(--text-color)" >Reported:</strong> {data.reporter}</p>
        <p><strong className="text-(--text-color)" >Confidence Level:</strong> {data.confidence_level}%</p>

        { data.reference && (
          <p><strong className="text-(--text-color)">Reference: </strong>
            <a href={data.reference} target="_blank" rel="noopener noreferrer" className="hover:text-(--primary-color)">
              {data.reference}
            </a>
          </p> 
        )}
      </div>
    </div>
  );
}

export default function TableUI({ dataTable }) {

  // Contar el todal de ul, domnios y ip para el Donutchart
  const ioc_total = dataTable.ioc_reported.length
  const urls      = dataTable.ioc_reported.filter(item => item.ioc_type === "url").length;
  const domains   = dataTable.ioc_reported.filter(item => item.ioc_type === "domain").length;
  const ips       = dataTable.ioc_reported.filter(item => item.ioc_type === "ip:port").length;


  const columns = useMemo(() => [
    { key: "country", header: "Source", type: "text"},
    { key: "ioc", header: "IOC",
      render: (ioc) =>{
        return (
          <p style={{
            color: "var(--text-secondary)",
            wordBreak: "break-word",     
            overflowWrap: "anywhere",     
            whiteSpace: "pre-wrap",
            minWidth: "200px",
            maxWidth: "250px",
            overflowY: "auto",    
            margin: 0,
          }}>
        {ioc}
      </p>
        )
      }
    },
    {
      key: "malware", header: "Malware",
      render: (malware) => {
        const color = hashToColor(malware);

        return (
          <span
            className="`${color}`inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
              background: `color-mix(in srgb, ${color} 16%, transparent)`,
              color: color,
            }}
            title={malware}
          >
            {malware || "-"}
          </span>
        );
      },
    },
    {
      key: "first_seen_utc",
      header: "First Seen",
      render: (first_seen_utc) => {
        return (
          <div className="flex flex-col leading-tight">
            <span className="text-xs">{formatHour(first_seen_utc)}</span>
            <span className="text-[10px] text-[var(--text-secondary)]/70">{formatDate(first_seen_utc)}</span>
          </div>
        );
      },
    },
    {
      key: "is_compromised", 
      header: "Status",
      render: (param) => {
        const isCompromised = Boolean(
          param.is_compromised ?? (typeof param === "boolean" ? param : false)
        );

        return isCompromised ? (
          <Badge variant="danger">Compromised</Badge>
        ) : (
          <Badge variant="success">Monitoring</Badge>
        );
      },
    },
  ], []);

  return (
    <MetricProvider exportable>
      <DataTable
        data={dataTable.ioc_reported}
        columns={columns}
        title={
          <>
          <Badge variant="">IOC FEED: {ioc_total}</Badge>
          <Badge variant="">URL: {urls}</Badge>
          <Badge variant="">Domains: {domains}</Badge>
          <Badge variant="">IP/Port: {ips}</Badge>
          </>
        }
        pageSize={10}
        searchable
        className="card-metricui"
        renderExpanded={(row) => <IocDetails data={row} />}
      />
    </MetricProvider>
  );
}


// Estas Tablas son para el dashboard, se utiliza para mostrar las noticias
// y los post de los grupos activos reportados.


const NEWS_COLUMNS = [
    { 
        key: "source", header: "Source", 
        render: (params) => {
        const color = hashToColor(params);
        return (
            <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
                background: `color-mix(in srgb, ${color} 16%, transparent)`,
                color: color,
            }}
            title={params}
            >
            {params}
            </span>
        );
        }  
    },
    { key: "title", header: "Title", type: "text" },
];

const NEWS_DETAILS = [{ key: "description", label: "Description" }];

const POST_COLUMNS = [
    { key: "source", header: "Source",
        render: (params) => {
        const color = hashToColor(params);
        return (
            <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
                background: `color-mix(in srgb, ${color} 16%, transparent)`,
                color: color,
            }}
            title={params}
            >
            {params}
            </span>
        );
        }
    },
    { 
        key: "group_name", header: "Group",
        render: (params) => {
        const color = hashToColor(params);
        return (
            <span
            className="inline-block px-1.5 py-0.5 rounded-[var(--radius-card)] text-xs font-medium truncate"
            style={{
                background: `color-mix(in srgb, ${color} 16%, transparent)`,
                color: color,
            }}
            title={params}
            >
            {params}
            </span>
        );
        }  
    },
    { key: "victim", header: "Victim", type: "text" },
    ];

const POST_DETAILS = [
    { key: "activity", label: "Activity" },
    { key: "description", label: "Description" },
];

function LinkedTable({ data, title, columns, urlKey, details }) {
    const handleRowClick = (row) => {
        const url = row?.[urlKey];
        if (url) window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <DataTable
        searchable
        title={title}
        data={data}
        columns={columns}
        pageSize={5}
        onRowClick={handleRowClick}
        className="card-metricui h-full overflow-hidden"
        renderExpanded={(row) => <RowDetails row={row} fields={details} />}
        />
    );
}

function RowDetails({ row, fields }) {
    return (
        <div className="grid grid-cols-1 gap-4 p-2 text-xs md:grid-cols-3">
        <div className="space-y-2 md:col-span-2 text-(--text-secondary)">
            {fields.map(({ key, label }) => (
            <p key={key}>
                <strong className="text-(--text-color)">{label}:</strong>{" "}
                {row?.[key]}
            </p>
            ))}
        </div>
        </div>
    );
}


export function TableNew({ dataTable }) {
    return (
        <LinkedTable
        data={dataTable}
        title="Today's Cybersecurity News"
        columns={NEWS_COLUMNS}
        urlKey="source_of_information"
        details={NEWS_DETAILS}
        />
    );
}

export function TablePost({ dataTable }) {
    return (
        <LinkedTable
        data={dataTable}
        title="Today's Posts"
        columns={POST_COLUMNS}
        urlKey="post_url"
        details={POST_DETAILS}
        />
    );
}