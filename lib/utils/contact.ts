export function telHref(phone: string): string {
  return `tel:${phone.replace(/[-\s]/g, "")}`;
}

export function mapsHref(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}
