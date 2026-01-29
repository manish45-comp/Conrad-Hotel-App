export const isNowWithinDateRange = (
  fromDate?: string,
  toDate?: string,
): boolean => {
  if (!fromDate || !toDate) return false;

  const now = new Date();

  // Parse FromDate → start of day (local)
  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);

  // Parse ToDate → end of day (local)
  const end = new Date(toDate);
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
};
