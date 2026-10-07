import { Suspense, useState, useEffect, useMemo } from "react"

import SimpleLogin from "@/pages/Login"
import { useAuth } from "@/context/AuthContext";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import { KpiCard, FilterBar, FilterProvider, Badge,
  DropdownFilter, useMetricFilters, DataTable } from "metricui";

import { Panel } from "@/components/ui/panel";
import Container from "@/components/Container"

import CustomInputButton from "@/components/ui/input"
import { UserRoundSearch } from "lucide-react";

const apiDomains = fetchData(endpoints.webAnalyzeD);


function LastDate({ apiData }) {
  const dateObj = useMemo(() => {
    if (!apiData?.date) return null;
    return new Date(apiData.date);
  }, [apiData?.date]);

  console.log(apiData?.date)

  const utcFormatted = dateObj.toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const localFormatted = dateObj.toLocaleTimeString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="absolute top-3 right-3 flex items-center gap-2 px-2 py-1">    
      <Badge variant="success" dot>Analyzed</Badge>
      <span className="text-[10px] font-bold tracking-wider text-slate-400">
        UTC {utcFormatted} / Local {localFormatted}
      </span>
    </div>
  );
}

function Box ({ apiData, onSearch }) {
    
    const data = apiData.read();
    const domains = apiDomains.read();

    const [inputValue, setInputValue] = useState("");

    // Notifica al componente externo
    const handleSearchSubmit = (urlEntered) => {
        if (!urlEntered || !urlEntered.trim()) return;
        onSearch(urlEntered.trim());
    };
    
    return(
        <>
        <FilterBar className="card-metricui">

            <CustomInputButton
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSubmit={handleSearchSubmit}
                placeholder="http://example.com"
                buttonContent={
                    <>
                        <UserRoundSearch size={16} />
                        <span>Analyze</span>
                    </>
                }
            />

            <DropdownFilter
            label="Domains analyzed"
            options={domains}
            field="domain"
            showAll
            />
            
            <LastDate apiData={data} />
            
        </FilterBar>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd)">
            <Panel title={`Screenshot: ${data.domain}`} className="lg:col-span-3">
                <img src={data.screenshotURL} alt={`Screenshot From ${data.domain}`}
                    className="w-full rounded-b-[var(--radius-card,14px)]"/>
            </Panel>
            <div className="lg:col-span-3">
                <DataTable
                className="card-metricui"
                data={data?.ipStats ?? []}
                columns={[
                    { key: "ip", header: "IP", type: "text" },
                    { key: "country_name", header: "Country", type: "text" },
                    { key: "description", header: "Description", type: "text" },
                ]}
                title={data?.domain ? `IPs:  ${data.ips_count}` : "IP Intelligence"}
                pageSize={8}
                searchable
                renderExpanded={(row) => (
                    <div className="space-y-1 text-(--text-secondary)">
                        <p><strong>ASN:</strong> {row.asn || "N/A"}</p>
                        <p><strong>Route:</strong> {row.route || "N/A"}</p>
                        <p><strong>PTR:</strong> {row.ptr || "N/A"}</p>
                        <p><strong>Timezone:</strong> {row.timezone || "N/A"}</p>
                    </div>
                )}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) pt-(--pd)">
            <DataTable
                data={data.links}
                columns={[{key: "href", header: "Link URL", type: "text"}]}
                title="Extracted Links"
                pageSize={10}
                searchable
                className="card-metricui w-full overflow-hidden"
            />
            <DataTable
                className="card-metricui"
                data={data?.cookies ?? []}
                columns={[{ key: "domain", header: "Domain", type: "text"}]}
                title={"COOKIES"}
                pageSize={8}
                searchable
                renderExpanded={(row) => (
                    <div className="space-y-1 text-(--text-secondary)">
                        <p><strong>Name:</strong> {row.name || "N/A"}</p>
                        <p><strong>Source Port:</strong> {row.sourcePort || "N/A"}</p>
                        <p><strong>Value:</strong> {row.value || "N/A"}</p>
                    </div>
                )}
            />

            <DataTable
                className="card-metricui"
                data={data?.redirects ?? []}
                columns={[{ key: "from", header: "From", type: "text"}]}
                title={"Redirects"}
                pageSize={8}
                searchable
                renderExpanded={(row) => (
                    <div className="space-y-1 text-(--text-secondary)">
                        <p><strong>From:</strong> {row.from || "N/A"}</p>
                        <p><strong>To:</strong> {row.to || "N/A"}</p>
                        <p><strong>Status:</strong> {row.status || "N/A"}</p>
                    </div>
                )}
            />
        </div>
        </>
    )
}


function SandboxBody() {
    const [searchedUrl, setSearchedUrl] = useState("");
    const filters = useMetricFilters();
    const selectedDomain = filters?.dimensions?.domain || "all";
    
    // Limpiar el input para evitar enviar nuevamente la solicitud
    // al usar los filtros
    useEffect(() => {
        if (searchedUrl) {
            setSearchedUrl("");
        }
    }, [selectedDomain]);

    const params = new URLSearchParams();
    
    if (searchedUrl) {
        params.set("url", searchedUrl);
    } else if (selectedDomain !== "all") {
        params.set("domain", selectedDomain);  
    }

    const webAnalyzeUrl = params.toString()
        ? `${endpoints.webAnalyze}?${params.toString()}`
        : endpoints.webAnalyze;

    const apiData = fetchData(webAnalyzeUrl);

    const handleDomainChange = () => {
        setSearchedUrl("");
    };

    return (
        <Container path = "~/Web Analyzer">

        <Suspense fallback={
            <>  
                <FilterBar className="card-metricui">
                    {searchedUrl ? (
                        <p className="text-(--text-color)">
                            Analyzing <span className="font-bold text-(--text-secondary)">{searchedUrl}</span>...
                        </p>
                    ) : (
                        <p className="text-(--text-color)">Loading...</p>
                    )}
                </FilterBar>
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-(--gp) pt-(--pd)">
                    <div className="lg:col-span-3">
                        <DataTable data={[]} loading className="card-metricui"/>
                    </div>
                    <div className="lg:col-span-3">
                        <DataTable data={[]} loading className="card-metricui"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) pt-(--pd)">
                    <DataTable data={[]} loading className="card-metricui"/>
                    <DataTable data={[]} loading className="card-metricui"/>
                    <DataTable data={[]} loading className="card-metricui"/>
                </div>
            </>
        }>
            <Box 
            apiData={apiData} 
            onSearch={(url) => setSearchedUrl(url)} 
                onClearSearch={handleDomainChange}
            />
        </Suspense >
        </Container>
    );
}

export default function WebAnalyze() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {return (<Container path="~/Loading..."/>);}

    if (!isAuthenticated) {
        return (
            <Container path="~/Login">
                <SimpleLogin />
            </Container>
        );
    }

    return (
        <FilterProvider>
            <SandboxBody />
        </FilterProvider>
    );
}