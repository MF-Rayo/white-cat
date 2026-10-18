export function formatHour(dateString) {
    const utcDate = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
    return new Date(utcDate).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(dateString) {
    const utcDate = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
    return new Date(utcDate).toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}