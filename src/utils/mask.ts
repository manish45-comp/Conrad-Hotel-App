export const maskNumber = (num?: string | null): string => {
  if (!num || num.length < 4) return "--";
  return "*".repeat(num.length - 4) + num.slice(-4);
};

export const maskIdNumber = (id?: string | null) => {
  if (!id) return "-";

  const clean = id.replace(/\s+/g, "");

  if (clean.length <= 4) return clean;

  const lastFour = clean.slice(-4);
  const maskedLength = clean.length - 4;

  const masked = "*".repeat(maskedLength);

  // Group masking for readability
  return `${masked}${lastFour}`.replace(/(.{4})/g, "$1 ").trim();
};
