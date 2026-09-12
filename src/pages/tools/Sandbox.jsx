import { Suspense, useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/AuthContext";
import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import SimpleLogin from "@/pages/Login"

import { KpiCard,FilterBar, FilterProvider,
  DropdownFilter, useMetricFilters, DataTable } from "metricui";

import { Panel } from "@/components/ui/panel";
import TerminalKitty from "@/components/ui/kitty";
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/hooks/ErrorBoundary";
import { SimpleMap } from "@/components/ui/map"

import CustomInputButton from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Search } from "lucide-react";

function Box ({ domainURL }) {

    const apiDomains = fetchData(endpoints.sandBoxDomain);
    const apiData = fetchData(domainURL);
    const data = apiData.read();

    if (data?.alert) {
        return (
            <Alert
                type={data.alert}
                message={data.message}
            />
        );
    }

    const columns = [
        { key: "ip", header: "IP", type: "text" },
        { key: "country_name", header: "Country", type: "text" },
        { key: "description", header: "Description", type: "text" },
    ];

    const rows = useMemo(() => {
        if (!data) return [];
        
        if (Array.isArray(data.ipStats) && data.ipStats.length > 0) {
            return data.ipStats;
        }
    }, [data]);


    const columnsDomains = [
        {
        key: "href",
        header: "Link URL",
        render: (param) => {

            const row = param && typeof param === "object" ? (param.row?.original ?? param.row ?? param) : {};
            const url = row.href || (typeof param === "string" ? param : "-");
            const anchorText = row.text || "";

            return (
            <div className="flex flex-col leading-tight min-w-0">
                <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-mono text-xs text-[var(--text-primary)] hover:underline"
                title={url}
                >
                {url}
                </a>
                {anchorText && (
                <span className="truncate text-[10px] text-[var(--text-secondary)]/70">
                    {anchorText}
                </span>
                )}
            </div>
            );
        },
        },
    ];
    

    const columnsCookies = [
        { key: "domain", header: "Domain", type: "text"}
    ];

    const rowsCookies = useMemo(() => {
        if (!data) return [];
        
        if (Array.isArray(data.cookies) && data.ipStats.length > 0) {
            return data.cookies;
        }
    }, [data]);


    const columnsRedirects = [
        { key: "from", header: "From", type: "text"}
    ];

    const rowsRedirects = useMemo(() => {
        if (!data) return [];
        
        if (Array.isArray(data.redirects) && data.ipStats.length > 0) {
            return data.redirects;
        }
    }, [data]);


    return(
        <>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 px-4 pt-4">
            <Panel title={`Screenshot ${data.host}`} className="lg:col-span-3">
                <img src={data.screenshotURL} alt={`Screenshot de ${data.domain}`}
                    className="w-full rounded-b-[var(--radius-card,14px)]"/>
            </Panel>
            <div className="lg:col-span-3">
                <DataTable
                className="card-metricui"
                data={rows}
                columns={columns}
                title={data?.host ? `IP Intelligence:  ${data.ips_count}` : "IP Intelligence"}
                pageSize={7}
                searchable
                renderExpanded={(row) => (
                    <div className="space-y-1">
                        <p><strong>ASN:</strong> {row.asn || "N/A"}</p>
                        <p><strong>Route:</strong> {row.route || "N/A"}</p>
                        <p><strong>PTR:</strong> {row.ptr || "N/A"}</p>
                        <p><strong>Timezone:</strong> {row.timezone || "N/A"}</p>
                    </div>
                )}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4">
            <div className="lg:col-span-2">
                <DataTable
                    data={data.links}
                    columns={columnsDomains}
                    title="Extracted Links"
                    pageSize={10}
                    searchable
                    className="card-metricui w-full overflow-hidden"
                />
            </div>
            <div className="lg:col-span-2">
                <DataTable
                className="card-metricui"
                data={rowsCookies}
                columns={columnsCookies}
                title={"COOKIES"}
                pageSize={8}
                searchable
                renderExpanded={(row) => (
                    <div className="space-y-1">
                        <p><strong>Name:</strong> {row.name || "N/A"}</p>
                        <p><strong>Source Port:</strong> {row.sourcePort || "N/A"}</p>
                        <p><strong>Value:</strong> {row.value || "N/A"}</p>
                    </div>
                )}
                />
            </div>

            <div className="lg:col-span-2">
                <DataTable
                className="card-metricui"
                data={rowsRedirects}
                columns={columnsRedirects}
                title={"Redirects"}
                pageSize={8}
                searchable
                renderExpanded={(row) => (
                    <div className="space-y-1">
                        <p><strong>From:</strong> {row.from || "N/A"}</p>
                        <p><strong>To:</strong> {row.to || "N/A"}</p>
                        <p><strong>Status:</strong> {row.status || "N/A"}</p>
                    </div>
                )}
                />
            </div>
        </div>
        </>
    )
}


function ResultFilters() {
    const apiDomains = fetchData(endpoints.sandBoxDomain);
    const domains = apiDomains.read();

    return (
    <div className="flex items-center gap-2">
      <div className="dropdown-align-left">
        <DropdownFilter
          label="Domains"
          options={domains}
          field="domain"
          showAll
          allLabel="Domains"
        />
      </div>
    </div>
    );
}


function SandboxBody({ search }) {
    const filters = useMetricFilters();

    const [query, setQuery] = useState("");
    const [scanDomain, setScanDomain] = useState(null)

    const selectedDomain = filters?.dimensions?.domain || "all";
    const params = new URLSearchParams();

    if (selectedDomain !== "all")params.set("domain", selectedDomain);

    const domainURL = params.toString()
    ? `${endpoints.sandBoxPrev}?${params}`
    : endpoints.sandBoxPrev;


    const scanParams = new URLSearchParams();
    if (scanDomain) scanParams.set("url", scanDomain);

    const scanURL = scanDomain
        ? `${endpoints.sandBoxScan}?${scanParams}`
        : null;

    const handleSearch = () => {
        if (!query.trim()) return;
        setScanDomain(query.trim());
    };

    return (
        <TerminalKitty
        path = "~/SandBox"
        headerContent={
            <Suspense>
                <CustomInputButton
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onSubmit={handleSearch}
                    placeholder="URL..."
                    buttonContent={<><Search size={16} /><span>SandBox</span></>}
                />
                <ResultFilters />
            </Suspense>
        }>
    
        {scanURL ? (
            <ErrorBoundary resetKey={scanURL} onRetry={() => invalidate(scanURL)}>
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-screen text-[var(--text-secondary)]">
                        <i className="bx bx-radar bx-spin text-[10vh] text-[var(--primary-color)]"></i>
                        <p className="text-[2vh] font-mono">Escanning {scanDomain}...</p>
                    </div>} key={scanURL}>
                    <Box domainURL={scanURL} />
                </Suspense>
            </ErrorBoundary>
        ):(
            <ErrorBoundary resetKey={domainURL} onRetry={() => invalidate(domainURL)}>
                <div className="min-h-screen">
                    <Suspense
                        fallback={
                            <>
                            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 px-4 pt-4">
                                <div className="lg:col-span-3">
                                    <DataTable data={[]} loading className="card-metricui"/>
                                </div>
                                <div className="lg:col-span-3">
                                    <DataTable data={[]} loading className="card-metricui"/>
                                </div>
                            </div>
                            </>
                        }key={domainURL}
                    >
                        <Box domainURL={domainURL} />
                    </Suspense >
                </div>
            </ErrorBoundary>
        )}

        </TerminalKitty>
    );
}


export default function Sandbox() {
    const [search] = useState("");
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
        <TerminalKitty path="~/Auth">
            <div className="flex flex-col items-center justify-center min-h-screen text-[var(--text-secondary)]">
                <i className="bx bx-loader-circle bx-spin text-[10vh] text-[var(--primary-color)]"></i>
                <p className="text-[2vh] font-mono">Loading...</p>
            </div>
        </TerminalKitty>    
        );
    }

    if (!isAuthenticated) {
        return (
            <TerminalKitty path="~/Login">
                <SimpleLogin />
            </TerminalKitty>
        );
    }

  return (
    <FilterProvider>
      <ErrorBoundary fallback={<div>Algo salió mal</div>}>
        <Suspense fallback={<TerminalKitty path="~/SandBox" />}>
          <SandboxBody search={search} />
        </Suspense>
      </ErrorBoundary>
    </FilterProvider>
  );
}