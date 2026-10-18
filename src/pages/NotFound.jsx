export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen font-sans text-center p-5">
            <h1 className="text-8xl font-bold m-0 text-[var(--primary-color)]">
                404
            </h1>

            <p className="text-xl mb-6 text-gray-500">
                Page not found
            </p>

            <a
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-800 no-underline rounded-full font-bold hover:bg-[var(--primary-color)] hover:text-white transition-colors duration-300"
            >
                Back to home
            </a>
        </div>
    );
}