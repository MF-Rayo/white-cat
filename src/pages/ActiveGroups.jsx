import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchData } from "@/lib/fetchData"
import { endpoints } from "@/lib/api"

import { FilterBar, FilterProvider, DropdownFilter, useMetricFilters } from "metricui"

import { CardImage, CardSkeleton, NoResults } from "@/components/ui/card"
import Container from "@/components/Container"
import { ErrorBoundary } from "@/hooks/ErrorBoundary.jsx";

const apiDate = fetchData(endpoints.activeGroupsDates)
const apiGroup = fetchData(endpoints.activeGroupsGroups)

function ActiveGroupsList({ apiData, search }) {
  const data = apiData.read();

  const filtered = data.filter((item) =>
    item.group_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-3 p-3">
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <CardImage
            key={item.post_url}
            title={`Group Name: ${item.group_name}`}
            summary={item.description}
            frontPage={item.screenshot}
            source={`Source: ${item.source}`}
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


function ActiveGroupsFilters() {
  const group = apiGroup.read();
  const dates = apiDate.read();

  return (
    <div className="flex items-center gap-2">
      <div className="dropdown-align-left">
        <DropdownFilter
          label="Group Name"
          options={group}
          field="name"
          showAll
          allLabel="All Groups"
        />
      </div>
      <div className="dropdown-align-left">
        <DropdownFilter
          label="Date"
          options={dates}
          field="date"
          showAll
          allLabel="Today's Report"
        />
      </div>
    </div>
  );
}


function ActiveGroupsBody({ search }) {
  const filters = useMetricFilters();

  const selectedGroup = filters?.dimensions?.name || "all";
  const selectedDate = filters?.dimensions?.date || "all";

  const params = new URLSearchParams();
  if (selectedDate !== "all") params.set("date", selectedDate);
  if (selectedGroup !== "all") params.set("groupname", selectedGroup);

  const activeGroupUrl = params.toString()
    ? `${endpoints.activeGroups}?${params}`
    : endpoints.activeGroups;

  const apiData = fetchData(activeGroupUrl);

  return (
    <Container
      path="~/Active Groups"
      headerContent={
        <Suspense>
          <ActiveGroupsFilters/>
        </Suspense>
      }
    >
      <div className="min-h-screen">
        <ErrorBoundary resetKey={activeGroupUrl} onRetry={() => invalidate(activeGroupUrl)}>
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-3 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>  
          } key={activeGroupUrl}>
            <ActiveGroupsList apiData={apiData} search={search} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Container>
  )
}

export default function ActiveGroups() {
  const [search] = useState("");

  return (
    <FilterProvider>
      <ActiveGroupsBody search={search} />
    </FilterProvider>
  );
}