import { useLocation, useNavigate } from "react-router-dom";

export default function NotFound() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-5 text-center font-sans">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary-color)]">
                Error 404
            </p>

            <h1 className="text-5xl font-bold text-white sm:text-7xl">
                Page not found
            </h1>

            <p className="max-w-md text-gray-400">
                We couldn't find{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-gray-200 break-all">
                    {pathname}
                </code>
                . It may have been moved or the address is wrong.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-full border border-white/20 px-6 py-3 font-bold text-gray-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]"
                >
                    Go back
                </button>
            </div>
        </main>
    );
}