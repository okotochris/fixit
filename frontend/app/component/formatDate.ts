export function formatDate(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  
  // Invalid date guard
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Future timestamps
  if (seconds < 0) return "just now";

  const intervals = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "week", secs: 604800 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "min", secs: 60 },
    { label: "sec", secs: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.secs);

    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}