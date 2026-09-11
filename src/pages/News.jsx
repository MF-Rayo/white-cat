import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchData } from "@/lib/fetchData"
import { endpoints } from "@/lib/api"

import { FilterBar, FilterProvider,
  DropdownFilter, useMetricFilters } from "metricui"

import { CardImage, CardSkeleton, NoResults } from "@/components/ui/card"
import TerminalKitty from "@/components/ui/kitty"
import { ErrorBoundary } from "@/hooks/ErrorBoundary"

const apiDate = fetchData(endpoints.newsDates)
const apiSource = fetchData(endpoints.newsSources)

function NewsList({ apiData, search }) {
  const data = apiData.read();

  const filtered = data.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-3 p-3">
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <CardImage
            key={item.url}
            title={item.title}
            summary={item.summary}
            frontPage={item.img}
            source={`Source: ${item.source}`}
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

function NewsFilters() {
  const sources = apiSource.read();
  const dates = apiDate.read();

  return (
    <div className="flex items-center gap-2">
      <div className="dropdown-align-left">
        <DropdownFilter
          label="News Source"
          options={sources}
          field="source"
          showAll
          allLabel="All News Sources"
        />
      </div>
      <div className="dropdown-align-left">
        <DropdownFilter
          label="Date"
          options={dates}
          field="date"
          showAll
          allLabel="Today's News"
        />
      </div>
    </div>
  );
}


function NewsBody({ search }) {
  const filters = useMetricFilters();

  const selectedSource = filters?.dimensions?.source || "all";
  const selectedDate = filters?.dimensions?.date || "all";

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
        <Suspense
          fallback={
            <>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-40" />
            </>
          }
        >
          <NewsFilters />
        </Suspense>
      }
    >
      <div className="min-h-screen">
        <ErrorBoundary resetKey={newsUrl} onRetry={() => invalidate(newsUrl)}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-3 p-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            }
            key={newsUrl}
          >
            <NewsList apiData={apiData} search={search} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </TerminalKitty>
  );
}

export default function News() {
  const [search] = useState("");

  return (
    <FilterProvider>
      <NewsBody search={search} />
    </FilterProvider>
  );
}