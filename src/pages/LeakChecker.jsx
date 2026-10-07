import { useState, useMemo, Suspense } from "react";

import SimpleLogin from "@/pages/Login"
import { useAuth } from "@/context/AuthContext";

import { endpoints } from "@/lib/api"
import { fetchData } from "@/lib/fetchData"

import Container from "@/components/Container"
import CustomInputButton from "@/components/ui/input"

import { FilterBar, FilterProvider } from "metricui";

import { ShieldAlert, ShieldCheck, ExternalLink, KeyRound, 
    UserRoundSearch } from "lucide-react";

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
        <img className="h-11 w-11 flex-shrink-0 rounded-lg object-cover bg-white"
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
        <>
        <article className="flex min-w-0 flex-col gap-(--gp) border border-(--border-color) bg-(--card-color) p-4 rounded-[var(--radius-card)]">
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
        </>
    );
}


function BreachContent({ apiData }) {
    if (!apiData) {
        return (
            <div className="text-center text-sm opacity-70 py-10 text-(--text-secondary)">
                Enter an email to analyze leaks.
            </div>
        );
    }

    const breachData = apiData.read();
    const breaches = breachData?.ExposedBreaches?.breaches_details ?? breachData?.breaches_details ?? [];

    if (breaches.length === 0) {
        return (
            <div className="text-center text-sm opacity-70 py-10 text-(--text-secondary)">
                No leaks were found for this email.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {breaches.map((b, i) => (
                <BreachCard breach={b} key={`${b.breach || b.name || i}-${i}`} />
            ))}
        </div>
    );
}

function BreachBody() {
    const [inputValue, setInputValue] = useState("");
    const [searchEmail, setSearchEmail] = useState("");

    const params = new URLSearchParams();
    if (searchEmail) params.set("email", searchEmail);

    const leakChekUrl = searchEmail ? `${endpoints.leakCheker}?${params.toString()}` : null;
    
    // Si no hay URL de inico, se pasa null para no realizar peticiones vacías
    const apiData = leakChekUrl ? fetchData(leakChekUrl) : null;

    const handleSearchSubmit = (value) => {
        if (!value || !value.trim()) return;
        setSearchEmail(value.trim());
    };

    return (
        <Container path="~/Leak Checker">
            <FilterBar className="card-metricui mb-4">
                <CustomInputButton
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onSubmit={handleSearchSubmit}
                    placeholder="user@example.com"
                    buttonContent={
                        <>
                            <UserRoundSearch size={16} />
                            <span>Analyze</span>
                        </>
                    }
                />
            </FilterBar>

            <Suspense fallback={
                <div className="text-center py-10 opacity-70 text-(--text-secondary)">
                    Analyzing email leaks...
                    </div>}>
                <BreachContent apiData={apiData} />
            </Suspense>
        </Container>
    );
}



export default function BreachPage() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {return (<Container path="~/Loading..."/>);}

    if (!isAuthenticated) {
        return (
            <Container path="~/Login">
                <SimpleLogin />
            </Container>
        );
    }

    return(
        <BreachBody/>
    )
}