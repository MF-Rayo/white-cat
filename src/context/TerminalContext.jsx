import { createContext, useContext, useState } from "react";

const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  // estas las define cada página según sus propios datos
  const [sourcesList, setSourcesList] = useState([]);
  const [datesList, setDatesList] = useState([]);

  const hasActiveFilters = search !== "" || selectedSource !== "all" || selectedDate !== "all";

  const handleClear = () => {
    setSearch("");
    setSelectedSource("all");
    setSelectedDate("all");
  };

  return (
    <TerminalContext.Provider
      value={{
        search, setSearch,
        selectedSource, setSelectedSource,
        selectedDate, setSelectedDate,
        sourcesList, setSourcesList,
        datesList, setDatesList,
        hasActiveFilters,
        handleClear,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export const useTerminal = () => useContext(TerminalContext);