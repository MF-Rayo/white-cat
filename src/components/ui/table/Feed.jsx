import { useMemo } from "react";
import { CustomBadge } from "@/components/ui/badge/Badge";
import { DataTable, MetricProvider, Badge } from "metricui"; 
import { hashToColor }  from "@/lib/hashColor"
import { IocDetails } from "@/components/ui/details/screenshot"
import {FormatDate} from "@/components/ui/date/FormatDate"

export default function TableUI({ dataTable }) {

  // Contar el todal de ul, domnios y ip
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
        return (<CustomBadge color={color} title={malware}/>);
      },
    },
    {
      key: "first_seen_utc",
      header: "First Seen UTC/LOCAL",
      render: (first_seen_utc) => {
        return (<FormatDate date={first_seen_utc}/>);
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
          <Badge variant="danger" dot>Compromised</Badge>
        ) : (
          <Badge variant="success" dot>Monitoring</Badge>
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
          <div className="space-x-2">
            <Badge variant="info"   dot>IOC FEED: {ioc_total}</Badge>
            <Badge variant="danger" dot>URL: {urls}</Badge>
            <Badge variant="danger" dot>Domains: {domains}</Badge>
            <Badge variant="danger" dot>IP/Port: {ips}</Badge>
          </div>
        }
        pageSize={7}
        searchable
        className="card-metricui"
        renderExpanded={(row) => <IocDetails data={row} />}
      />
    </MetricProvider>
  );
}