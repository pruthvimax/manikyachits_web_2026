// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Sanitize input (remove HTML tags)
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '');
};

// Generate a simple ID for reference
const generateReferenceId = () => {
  return 'REF' + Date.now().toString(36).toUpperCase();
};

module.exports = {
  formatDate,
  sanitizeInput,
  generateReferenceId
};