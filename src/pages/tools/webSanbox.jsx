import TerminalKitty from "@/components/ui/kitty";
import { Suspense, useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";
import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import SimpleLogin from "@/pages/Login.jsx"
import { Filter } from "@/components/ui/filter"
import { KpiCard, KpiCardSkeleton } from "@/components/ui/card"
import { Panel, PanelSkeleton } from "@/components/ui/panel"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/hooks/ErrorBoundary";
import { SimpleMap } from "@/components/ui/map"
import { ShieldAlert, Globe2, Activity, Skull, Link2, Server, ChevronsLeftRightEllipsis, 
        Route, Search} from "lucide-react"
import CustomInputButton from "@/components/ui/input"
import { useAlert } from "@/context/AlertContext";


function Box({ apiData }) {
    const data = apiData.read();
    const { showAlert } = useAlert();
    useEffect(() => {
        if (data?.alert) {
            showAlert({ type: data.alert, message: data.message });
        }
    }, [data]);

    if (data?.alert) {
        return (
            <div/>
        );
    }

    return (
    <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                label="Links Found"
                value={data.links_count}
                icon={Globe2}
                accent={"var(--primary-color)"}
            />
            <KpiCard
                label="Domains"
                value={data.domain_count}
                icon={Activity}
                accent={"var(--primary-color)"}
            />
            <KpiCard
                label="IPs / Requests"
                value={data.ips_count}
                icon={ShieldAlert}
                accent={"var(--primary-color)"}
            />
            <KpiCard
                label="Certificates"
                value={data.certificate_count}
                icon={Skull}
                accent={"var(--primary-color)"}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <Panel title="Screenshot" className="lg:col-span-4">
                <img src={data.screenshotURL} alt={`Screenshot de ${data.domain}`}
                    className="w-full rounded-b-[var(--radius-card,14px)]"/>
            </Panel>
            <div className="lg:col-span-2 flex flex-col gap-4">
                <Panel title="Overview" className="flex-1 min-h-0">
                    <div className="flex flex-col gap-4 p-5 text-sm">
                        {[
                            {
                                icon: <ChevronsLeftRightEllipsis  size={16} />,
                                label: "Domain",
                                value: data?.domain ?? "N/A",
                            },
                            {
                                icon: <Server size={16} />,
                                label: "Server",
                                value: data?.servers?.join(", ") || "N/A",
                            },
                            {
                                icon: <Route size={16} />,
                                label: "Redirects",
                                value: data?.redirects && data.redirects.length > 0 ? (
                                    <span className="flex flex-col gap-1">
                                        {data.redirects.map((item, index) => (
                                            <span key={index} className="block text-xs">
                                                <span className="font-semibold text-(--primary-color)">[{item.status}]</span>{" "}
                                                <span className="text-(--text-color)">{item.to}</span>
                                            </span>
                                        ))}
                                    </span>
                                ) : (
                                    "N/A"
                                ),
                            }
                        ].map((item, index) => (
                            <div
                            key={index}
                            className="grid grid-cols-[20px_1fr_auto] items-start gap-x-3 gap-y-1"
                            >
                            <div className="flex items-center h-5 text-(--primary-color) mt-0.5">
                                {item.icon}
                            </div>
                            <p className="text-(--primary-color) font-medium truncate h-5 flex items-center font-semibold">
                                {item.label}
                            </p>
                            <p className="text-(--text-color) text-right break-words leading-relaxed max-w-[220px] ml-auto">
                                {item.value}
                            </p>
                            </div>
                        ))}
                    </div>
                </Panel>
                <Panel title={`Certificates (${data.certificate_count})`} className="flex-1 min-h-0">
                    <div className="flex flex-col gap-2 text-sm p-4 overflow-y-auto max-h-full">
                        {data.certificates.map((cert, i) => (
                            <div key={i}>
                                <p className="font-medium text-(--primary-color)">{cert.subjectName}</p>
                                <p className="text-xs text-muted-foreground">
                                    Issuer: {cert.issuer} · Valid until:{" "}
                                    {new Date(cert.validTo * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <Panel title={`IP Stats (${data.ips_count})`} className="lg:col-span-4" >
                <div className="flex flex-col gap-3 p-4 overflow-y-auto max-h-[50vh]">
                    {data.ipStats.map((stat, i) => (
                        <div key={i}
                            className="flex items-center justify-between text-sm pb-2 last:border-0"
                        >
                            <div className="flex items-center gap-2">
                                <Server size={14} className="text-(--primary-color)" />
                                <span className="text-(--primary-color)">{stat.ip}</span>
                            </div>
                            <div className="text-muted-foreground text-xs">
                                {stat.description ?? "N/A"}
                            </div>
                            <div className="text-xs">{stat.country_name ?? "N/A"}</div>
                        </div>
                    ))}
                </div>
            </Panel>
                
            <div className="lg:col-span-2 rounded-[var(--radius-card,14px)] lg:h-full overflow-hidden min-h-[50vh]">
                <SimpleMap data={data.ipStats}/>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <Panel title={`Links (${data.links_count})`} className="lg:col-span-3">        
                <div className="max-h-[50vh] overflow-y-auto p-4">
                    {data.links.map((link, i) => (
                    <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-2 text-sm hover:text-(--primary-color) transition-colors"
                    >
                        <Link2 size={14} className="shrink-0 text-muted-foreground" />
                        <span className="truncate">{link.text || link.href}</span>
                    </a>
                    ))}
                </div>
            </Panel>
            <Panel title={`Cookies (${data?.cookies?.length || 0})`} className="lg:col-span-3">
                <div className="max-h-[50vh] overflow-y-auto p-4 divide-y divide-border">
                    {data?.cookies && data.cookies.length > 0 ? (
                    data.cookies.map((cookie, i) => (
                        <div key={i} className="py-3 text-sm space-y-1.5 first:pt-0 last:pb-0">
                        {/* Fila 1: Nombre y Badges */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-(--primary-color) break-all">
                            {cookie.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px]">
                            {cookie.secure && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
                                Secure
                                </span>
                            )}
                            {cookie.httpOnly && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium">
                                HttpOnly
                                </span>
                            )}
                            {cookie.sameSite && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium">
                                SameSite: {cookie.sameSite}
                                </span>
                            )}
                            </div>
                        </div>

                        <div className="font-mono text-xs text-muted-foreground bg-muted/40 p-1.5 rounded break-all max-h-20 overflow-y-auto">
                            {cookie.value || "<empty>"}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span>
                            <strong className="font-medium text-foreground">Domain:</strong> {cookie.domain}
                            </span>
                            <span>
                            <strong className="font-medium text-foreground">Path:</strong> {cookie.path}
                            </span>
                            {cookie.size && (
                            <span>
                                <strong className="font-medium text-foreground">Size:</strong> {cookie.size} B
                            </span>
                            )}
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No cookies were found.
                    </p>
                    )}
                </div>
            </Panel>
        </div>

    </div>
    );
}

export default function Sandbox() {
    const { isAuthenticated, loading } = useAuth();
    const [selectedDomain, setSelectedDomain] = useState("all");
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [activeURL, setActiveURL] = useState(null);

    if (loading) {
        return (
            <TerminalKitty path="~/Auth">
                <div className="min-h-screen p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCardSkeleton />
                        <KpiCardSkeleton />
                        <KpiCardSkeleton />
                        <KpiCardSkeleton />
                    </div>
                    <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <PanelSkeleton className="min-h-[80vh] lg:col-span-4" />
                        <PanelSkeleton className="min-h-[80vh] lg:col-span-2" />
                    </div>
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

    const params = new URLSearchParams();
    if (selectedDomain !== "all") params.set("domain", selectedDomain);
    const boxURL = params.toString()
        ? `${endpoints.sandBoxPrev}?${params}`
        : endpoints.sandBoxPrev;

    const url = activeURL ?? boxURL;
    const apiData = fetchData(url);

    const handleSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) return;

        const normalized = /^https?:\/\//i.test(trimmed)
            ? trimmed
            : `https://${trimmed}`;

        setSearching(true);
        setActiveURL(`${endpoints.sandBoxScan}?url=${encodeURIComponent(normalized)}`);
    };

    const apiSandBoxDomain = fetchData(endpoints.sandBoxDomain);

    return (
        <TerminalKitty path="~/Web Sandbox"
            headerContent={
                <ErrorBoundary resetKey={endpoints.sandBoxDomain} onRetry={() => invalidate(endpoints.sandBoxDomain)}>
                    <Suspense fallback={
                        <>
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="h-8 w-40" />
                        </>
                    }>
                        <CustomInputButton
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onSubmit={handleSearch}
                            placeholder="Search by domain or IP address..."
                            buttonContent={<><Search size={16} /><span>Search</span></>}
                        />
                        <Filter
                            label="Domains & IP Address"
                            apiData={apiSandBoxDomain}
                            selected={selectedDomain}
                            onChange={setSelectedDomain}
                        />
                    </Suspense>
                </ErrorBoundary>
            }
        >
            <div className="min-h-screen p-4">
                <ErrorBoundary resetKey={url} onRetry={() => invalidate(url)}>
                    <Suspense
                        key={url}
                        fallback={
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <KpiCardSkeleton />
                                    <KpiCardSkeleton />
                                    <KpiCardSkeleton />
                                    <KpiCardSkeleton />
                                </div>
                                <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 gap-4">
                                    <PanelSkeleton className="min-h-[80vh] lg:col-span-4" />
                                    <PanelSkeleton className="min-h-[80vh] lg:col-span-2" />
                                </div>
                            </>
                        }
                    >
                        <Box apiData={apiData} />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </TerminalKitty>
    );
}