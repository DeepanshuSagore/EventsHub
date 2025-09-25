export function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateId(...collections) {
  const ids = collections
    .filter(Boolean)
    .flatMap((items) => items.map((item) => item.id))
    .filter((id) => typeof id === 'number' && Number.isFinite(id));

  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return maxId + 1;
}
