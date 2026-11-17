/**
 * Date formatting helpers
 */
export function formatDate(dateString) {
  if (!dateString) return 'No deadline';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date); // e.g. "20 Oct 2026"
  } catch (e) {
    return dateString;
  }
}
