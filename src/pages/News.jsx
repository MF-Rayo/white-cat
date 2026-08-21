import { Suspense, useState } from "react"
import { Filter } from "@/components/ui/filter"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchData } from "@/lib/fetchData"
import { endpoints } from "@/lib/api"
import { CardImage, CardSkeleton, NoResults } from "@/components/ui/card"
import TerminalKitty from "@/components/ui/kitty"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const apiDate = fetchData(endpoints.newsDates)
const apiSource = fetchData(endpoints.newsSources)

function NewsList({ apiData, search }) {
  const data = apiData.read();

  const filtered = data.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-3">
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <CardImage
            key={item.url}
            title={item.title}
            summary={item.summary}
            frontPage={item.img}
            source={item.source}
            date={item.date}
            url={item.url}
          />
        ))
      ) : (
        <NoResults />
      )}
    </div>
  );
}

export default function News() {
  const [search] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const params = new URLSearchParams();
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedSource !== "all") params.set("source", selectedSource);

  const newsUrl = params.toString()
    ? `${endpoints.news}?${params}`
    : endpoints.news;

  const apiData = fetchData(newsUrl);

  return (
    <TerminalKitty
      path="~/News"
      headerContent={
        <Suspense fallback={
          <>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-40" />
          </>
        }>
          <Filter
            label="All News Sources"
            apiData={apiSource}
            selected={selectedSource}
            onChange={setSelectedSource}
          />
          <Filter
            label="Today's News"
            apiData={apiDate}
            selected={selectedDate}
            onChange={setSelectedDate}
          />
        </Suspense>
      }
    >
      <div className="min-h-screen">
        <ErrorBoundary resetKey={newsUrl} onRetry={() => invalidate(newsUrl)}>
          <Suspense fallback={<CardSkeleton />} key={newsUrl}>
            <NewsList apiData={apiData} search={search} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </TerminalKitty>
  )
}