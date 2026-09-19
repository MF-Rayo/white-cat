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
      try {
        setData(JSON.parse(event.data));
      } catch (e) {
        console.error("Error parseando SSE:", e);
      }
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