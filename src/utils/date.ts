export const formatForAPI = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
};

export const formatDateOnly = (str?: string | null): string => {
  if (!str || typeof str !== "string") return "--";
  return str.split("T")[0] ?? "--";
};
