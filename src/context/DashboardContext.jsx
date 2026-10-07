import { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/fetchData";
import { endpoints } from "@/lib/api";

const DashboardSummaryContext = createContext(null);

export function DashboardSummaryProvider({ children }) {
  const resource = fetchData(endpoints.summary);
  const initialData = resource.read();

  const [data, setData] = useState(initialData);
  const esRef = useRef(null);

  useEffect(() => {
    const es = new EventSource(endpoints.summarySSE, { withCredentials: true });
    esRef.current = es;

    es.addEventListener("update", (event) => {
      setData(JSON.parse(event.data));
    });

    es.onerror = (err) => {
      console.warn("SSE error reconectando", err);
    };

    return () => es.close();
  }, []);

  return (
    <DashboardSummaryContext.Provider value={data}>
      {children}
    </DashboardSummaryContext.Provider>
  );
}

export function useDashboardSummary() {
  const ctx = useContext(DashboardSummaryContext);
  return ctx;
}