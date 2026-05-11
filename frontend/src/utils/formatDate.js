export const formatDate = (dateStr, options = {}) => {
  const date = new Date(dateStr);
  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  return new Intl.DateTimeFormat('id-ID', defaultOptions).format(date);
};

export const formatDateOnly = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export default formatDate;
