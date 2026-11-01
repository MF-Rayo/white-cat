import { Badge} from "metricui";

function toDate(dateString) {
  const hasTimezone = /(Z|[+-]\d{2}(:?\d{2})?)$/i.test(dateString);
  const normalized = hasTimezone ? dateString : `${dateString}Z`;
  return new Date(normalized);
}

export function formatHour(dateString, { utc = false, hour12 = false } = {}) {
  return toDate(dateString).toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: hour12,
    ...(utc && { timeZone: "UTC" }),
  });
}

export function formatDate(dateString, { utc = false } = {}, format = "long" ) {
  return toDate(dateString).toLocaleString(undefined, {
    day: "2-digit",
    month: format,
    year: "numeric",
    ...(utc && { timeZone: "UTC" }),
  });
}

export function FormatDate({ date, type, format}) {

  const utcHour = formatHour(date, { utc: true, hour12: false });
  const localHour = formatHour(date, { utc: false, hour12: true });

  const utcDateFormatted = formatDate(date, { utc: true }, format);
  const localDateFormatted = formatDate(date, { utc: false }, format);

  // Comprobar si la fecha UTC y la local caen en el mismo día
  const isSameDate = utcDateFormatted === localDateFormatted;

  if (type == "horizontal"){
    return(
      <div className="absolute top-3 right-3 flex items-center gap-2 px-2 py-1">    
        <Badge variant="info" dot>Updated</Badge>
        <span className="text-[10px] font-bold tracking-wider text-white/80">
          UTC {utcHour} | Local {localHour}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col py-1 space-y-1">
      <div className="flex items-center text-xs font-semibold tracking-wide">
        <span className="text-[var(--text-primary)]">{utcHour}</span>
        <span className="text-[var(--text-secondary)]/40 mx-1.5">/</span>
        <span className="text-[var(--text-primary)]">{localHour}</span>
      </div>

      <div className="flex flex-col text-[10px] text-[var(--text-secondary)]/70 space-y-0.5">
        {isSameDate ? (
          <span>{utcDateFormatted}</span>
        ) : (
          <>
            <span>UTC: {utcDateFormatted}</span>
            <span>Local: {localDateFormatted}</span>
          </>
        )}
      </div>
    </div>
  );
}