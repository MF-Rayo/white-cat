import { Suspense, useState } from "react"
import { Filter } from "@/components/ui/filter"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchData } from "@/lib/fetchData"
import { endpoints } from "@/lib/api"
import { CardImage, CardSkeleton, NoResults } from "@/components/ui/card"
import TerminalKitty from "@/components/ui/kitty"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const apiDate = fetchData(endpoints.activeGroupsDates)
const apiGroup = fetchData(endpoints.activeGroupsGroups)

function ActiveGroupsList({ apiData, search }) {
  const data = apiData.read();

  const filtered = data.filter((item) =>
    item.group_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-3">
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <CardImage
            key={item.post_url}
            title={`${item.group_name}`}
            summary={item.description}
            frontPage={item.screenshot}
            source={item.source}
            date={item.date}
            url={item.post_url}
          />
        ))
      ) : (
        <NoResults />
      )}
    </div>
  );
}

export default function ActiveGroups() {
  const [search] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [selectedDate, setSelectedDate] = useState("all")

  const params = new URLSearchParams();
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedGroup !== "all") params.set("groupname", selectedGroup);

  const activeGroupUrl = params.toString()
    ? `${endpoints.activeGroups}?${params}`
    : endpoints.activeGroups;

  const apiData = fetchData(activeGroupUrl);

  return (
    <TerminalKitty
      path="~/ActiveGroups"
      headerContent={
        <Suspense fallback={
          <>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-40" />
          </>
        }>
          <Filter
            label="All Active Groups"
            apiData={apiGroup}
            selected={selectedGroup}
            onChange={setSelectedGroup}
          />
          <Filter
            label="Today's Report"
            apiData={apiDate}
            selected={selectedDate}
            onChange={setSelectedDate}
          />
        </Suspense>
      }
    >
      <div className="min-h-screen">
        <ErrorBoundary resetKey={activeGroupUrl} onRetry={() => invalidate(activeGroupUrl)}>
          <Suspense fallback={<CardSkeleton />} key={activeGroupUrl}>
            <ActiveGroupsList apiData={apiData} search={search} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </TerminalKitty>
  )
}