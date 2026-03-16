/**
 * Simple HTML sanitizer
 * Strips all tags from a string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>?/gm, '').trim();
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

/**
 * Basic Magic Bytes Check for Images
 * JPEG: FF D8 FF
 * PNG: 89 50 4E 47
 * WEBP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
 */
const isValidImageBuffer = (buffer) => {
  if (!buffer || buffer.length < 4) return false;
  
  const hex = buffer.toString('hex', 0, 4).toUpperCase();
  
  // JPEG
  if (hex.startsWith('FFD8FF')) return true;
  // PNG
  if (hex === '89504E47') return true;
  // WEBP (RIFF)
  if (hex === '52494646') return true;

  return false;
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  isValidImageBuffer
};
