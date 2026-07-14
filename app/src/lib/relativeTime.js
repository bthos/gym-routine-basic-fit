/** "hoy" / "ayer" / "hace N días" — cosmetic day-granularity relative label shared by Home and History. */
export function formatRelativeDays(dateStr, now = new Date()) {
  const then = new Date(dateStr);
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startOfDay(now) - startOfDay(then)) / 86400000);
  if (diffDays <= 0) return 'hoy';
  if (diffDays === 1) return 'ayer';
  return `hace ${diffDays} días`;
}
