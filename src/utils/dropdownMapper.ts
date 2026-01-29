export const mapVisitorTypes = (list: any[]) => {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    label: item.Name,
    value: item.Name, // or item.Name if you prefer text
  }));
};

export const mapVisitorPurpose = (list: any[]) => {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    label: item.Name,
    value: item.Name, // or item.Name
  }));
};

export const mapIdProofTypes = (list: any[]) => {
  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    label: item.Name,
    value: item.Name, // or item.Id if needed
  }));
};

export const mapVehicleTypes = (list: any[]) => {
  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    label: item.Name,
    value: item.Name, // or item.Id if needed
  }));
};

export const formatDate = (d: Date | null) => {
  if (!d) return null;
  return d.toISOString().split("T")[0];
  // "2025-11-25"
};

export const formatTime = (d: Date | null) => {
  if (!d) return null;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  // "10:45 AM"
};
