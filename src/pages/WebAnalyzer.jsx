import { Suspense, useState, useEffect, useMemo } from "react"

import SimpleLogin from "@/pages/Login"
import { useAuth } from "@/context/AuthContext";
import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { ErrorBoundary } from "@/hooks/ErrorBoundary"

import { FilterBar, FilterProvider, BarChart,
    DropdownFilter, useMetricFilters, DataTable } from "metricui";

import { Panel } from "@/components/ui/panel";
import Container from "@/components/Container"

import CustomInputButton from "@/components/ui/input"
import { UserRoundSearch } from "lucide-react";


function Box({ apiData, apiDomains, onSearch }) {
    const data = apiData.read()?.[0];
    const domains = apiDomains.read();
    const [url, setUrl] = useState("");

    // Un snapshot por día, del más nuevo al más viejo.
    const archiveRows = useMemo(() => {
        return [...(data?.archive ?? [])]
            .filter((s) => s.date && s.url)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((s) => ({
                date: s.date.slice(0, 10),
                url: s.url,
            }));
    }, [data]);

    const domainRows = useMemo(
        () => (data?.domains ?? []).map((d) => ({ domain: d })),
        [data]
    );

    const serverRows = useMemo(
        () => (data?.servers ?? []).map((s) => ({ server: s })),
        [data]
    );

    return (
        <>
            <FilterBar className="card-metricui">
                <CustomInputButton
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onSubmit={(v) => v.trim() && onSearch(v.trim())}
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
                    field="domain" />
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
                    title={`IPs: ${data.ips_count}`}
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
                    className="card-metricui w-full overflow-hidden"
                />
                <div className="grid grid-cols-1 gap-(--gp)">
                    <DataTable
                        className="card-metricui"
                        data={data?.cookies ?? []}
                        columns={[{ key: "domain", header: "Domain", type: "text"}]}
                        title={"COOKIES"}
                        pageSize={5}
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
                        pageSize={1}
                        renderExpanded={(row) => (
                            <div className="space-y-1 text-(--text-secondary)">
                                <p><strong>From:</strong> {row.from || "N/A"}</p>
                                <p><strong>To:</strong> {row.to || "N/A"}</p>
                                <p><strong>Status:</strong> {row.status || "N/A"}</p>
                            </div>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-(--gp)">
                    <DataTable
                        className="card-metricui"
                        data={domainRows}
                        columns={[{ key: "domain", header: "Domain", type: "text" }]}
                        title={`Domains (${domainRows.length})`}
                        pageSize={5}
                    />
                    <DataTable
                        className="card-metricui"
                        data={serverRows}
                        columns={[{ key: "server", header: "Server", type: "text" }]}
                        title={`Servers (${serverRows.length})`}
                        pageSize={2}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-(--gp) pt-(--pd)">
                <DataTable
                    className="card-metricui"
                    data={archiveRows}
                    columns={[
                        { key: "date", header: "Date", type: "text" },
                        { key: "url", header: "URL", type: "text" },
                    ]}
                    title={`Wayback Machine (${archiveRows.length})`}
                    pageSize={10}
                />
                <DataTable
                    className="card-metricui"
                    data={data?.certificates ?? []}
                    columns={[
                        { key: "subjectName", header: "Subject", type: "text" },
                        { key: "issuer", header: "Issuer", type: "text" },
                        { key: "validFrom", header: "Valid From", type: "text" },
                        { key: "validTo", header: "Valid To", type: "text" },
                    ]}
                    title={`Certificates (${(data?.certificates ?? []).length})`}
                    pageSize={10}
                    searchable
                />
            </div>
        </>
    );
}

function SandboxBody() {
    const [searchedUrl, setSearchedUrl] = useState("");
    const filters = useMetricFilters();
    const selectedDomain = filters?.dimensions?.domain || "all";

    useEffect(() => {
        if (searchedUrl) setSearchedUrl("");
    }, [selectedDomain]);

    const apiDomains = useMemo(() => fetchData(endpoints.webAnalyzeD), []);

    const apiData = useMemo(() => {
        const params = new URLSearchParams();
        if (searchedUrl) {
            params.set("url", searchedUrl);
        } else if (selectedDomain !== "all") {
            params.set("domain", selectedDomain);
        }
        const qs = params.toString();
        return fetchData(qs ? `${endpoints.webAnalyze}?${qs}` : endpoints.webAnalyze);
    }, [searchedUrl, selectedDomain]);

    return (
        <Container path="~/Web Analyzer">
            <ErrorBoundary resetKey={apiData}>
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
                                <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
                            </div>
                            <div className="lg:col-span-3">
                                <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--gp) pt-(--pd)">
                            <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
                            <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
                            <BarChart data={[]} loading className="card-metricui h-full overflow-hidden"/>
                        </div>
                    </>
                }>
                    <Box
                        apiData={apiData}
                        apiDomains={apiDomains}
                        onSearch={setSearchedUrl}
                    />
                </Suspense>
            </ErrorBoundary>
        </Container>
    );
}


export default function WebAnalyze() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Container path="~/Loading..." />;

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