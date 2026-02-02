export const formatForAPI = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

export const formatDateOnly = (str?: string | null): string => {
  if (!str || typeof str !== "string") return "--";
  return str.split("T")[0] ?? "--";
};
