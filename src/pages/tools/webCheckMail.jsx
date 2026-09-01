import { useState, useMemo, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import SimpleLogin from "@/pages/Login"
import { Skeleton } from "@/components/ui/skeleton"
import CustomInputButton from "@/components/ui/input"
import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"
import { ErrorBoundary } from "@/hooks/ErrorBoundary";
import TerminalKitty from "@/components/ui/kitty";
import { ShieldAlert, ShieldCheck, ExternalLink, KeyRound, Search } from "lucide-react";


function formatRecords(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    return String(n);
}

function riskMeta(risk) {
    const key = (risk || "").toLowerCase();
    if (key.includes("easy")) {
        return { label: "Easy to crack", text: "text-(--danger-color)" };
    }
    if (key.includes("hard") || key.includes("strong")) {
        return { label: "Hard to crack", text: "text-(--warning-color)" };
    }
    return { label: risk || "Unknown risk", text: "text-(--info-color)" };
}

function BreachLogo({ src, name }) {
    const [setFailed] = useState(false);
    return (
        <img className="h-11 w-11 flex-shrink-0 rounded-lg border 
        border-(--primary-color) bg-(--primary-color)/20 object-cover"
        src={src} alt={`${name}`} onError={() => setFailed(true)} loading="lazy"/>
    );
}

function BreachCard({ breach }) {
    const { breach: name, details, domain, industry, logo, password_risk,
        references, verified, xposed_data, xposed_date, xposed_records } = breach;

    const risk = riskMeta(password_risk);
    const dataFields = (xposed_data || "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
    const isVerified = (verified || "").toLowerCase() === "yes";

    return (
            <article className="flex min-w-0 flex-col gap-3.5 border border-(--border-color) p-4 m-4 bg-(--bg-color)/60 backdrop-blur-xl rounded-[var(--radius-card,14px)]">
            <header className="flex items-start gap-3">
                <BreachLogo src={logo} name={name} />
                <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold leading-tight text-(--text-color)">
                    {name}
                </h3>
                {domain && (
                    <a className="text-xs text-(--text-secondary) hover:text-(--primary-color)"
                    href={`https://${domain}`} target="_blank" rel="noreferrer"> {domain}</a>
                )}
                </div>
                {(isVerified && (
                <span className="inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full 
                    border border-(--success-color)/30 bg-(--success-color)/10 px-2 py-0.5 text-xs text-(--success-color)"
                    title="Brecha verificada">
                    <ShieldCheck size={14} strokeWidth={2.25} />
                    Verified
                </span>
                )) || 
                <span className="inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full 
                    border border-(--danger-color)/30 bg-(--danger-color)/10 px-2 py-0.5 text-xs text-(--danger-color)"
                    title="Brecha verificada">
                    <ShieldCheck size={14} strokeWidth={2.25} />
                    No verified
                </span>
                }
            </header>

            <div className="flex flex-wrap gap-1.5">
                {industry && (
                <span className="rounded-full border border-(--primary-color)/25 bg-(--primary-color)/10 px-2.5 py-0.5 text-xs text-(--primary-color)">
                    {industry}
                </span>
                )}
                {xposed_date && (
                <span className="rounded-full border border-(--warning-color)/25 bg-(--warning-color)/20 px-2.5 py-0.5 text-xs text-(--warning-color)">
                    {xposed_date}
                </span>
                )}
            </div>

            <p className="line-clamp-4 text-sm leading-relaxed text-(--text-secondary)">{details}</p>

            <div className="grid grid-cols-2 gap-2.5 border-t border-(--border-hover) pt-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-mono text-lg font-semibold text-(--text-color)">
                    {formatRecords(xposed_records)}
                </span>
                <span className="text-[11px] text-(--text-secondary)">Exposed accounts</span>
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${risk.text}`}>
                    <ShieldAlert size={16} strokeWidth={2.25} />
                    {risk.label}
                </span>
                <span className="text-[11px] text-(--text-secondary)">Password Risk</span>
                </div>
            </div>

            {dataFields.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                {dataFields.map((field) => (
                    <span
                    key={field}
                    className="inline-flex items-center gap-1 rounded-md border border-(--warning-color)/40 bg-(--warning-color)/20 px-2 py-0.5 text-[11px] text-(--warning-color)"
                    >
                    <KeyRound size={12} strokeWidth={2.25} />
                    {field}
                    </span>
                ))}
                </div>
            )}

            {references && (
                <a className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-xs font-semibold text-(--primary-color) hover:underline"
                href={references} target="_blank" rel="noreferrer">
                Go to source
                <ExternalLink size={14} strokeWidth={2.25} />
                </a>
            )}
        </article>
    );
}


function BreachList({ url }) {
    const apiData = fetchData(url);
    const breachData = apiData.read();

    const breaches = breachData?.ExposedBreaches?.breaches_details ?? breachData?.breaches_details ?? [];
    
    if (breaches.length === 0) {
        return (
            <div className="text-center text-sm opacity-70 py-10">
                No leaks were found for this email.
            </div>
        );
    }

    return (
        <>
            {breaches.map((b, i) => (
                <BreachCard breach={b} key={`${b.breach}-${i}`} />
            ))}
        </>
    );
}


export default function Mail(){
    const { isAuthenticated, loading } = useAuth();
    const [query, setQuery] = useState("");
    const [activeURL, setActiveURL] = useState(null);

    if (loading) {
        return (
            <TerminalKitty path="~/Auth">
                <div>cargando</div>
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

    const handleSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        setActiveURL(`${endpoints.checkMail}?email=${encodeURIComponent(trimmed)}`);
    };


    return(
        <TerminalKitty path="~/Check Mail"
            headerContent={
                <CustomInputButton
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onSubmit={handleSearch}
                    placeholder="Email..."
                    buttonContent={<><Search size={16} /><span>Check</span></>}
                />
            }>

        {activeURL && (
            <ErrorBoundary resetKey={activeURL} onRetry={() => invalidate(activeURL)}>
                <Suspense key={activeURL} fallback={
                    <div className="m-4 border border-(--border-color)">
                        <Skeleton className="h-[50vh] w-full" />
                    </div>}>
                    <BreachList url={activeURL} />
                </Suspense>
            </ErrorBoundary>
        )}
        </TerminalKitty>
    )
}