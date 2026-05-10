/**
 * @param {Object} res - Express response object
 * @param {string} message - Pesan sukses
 * @param {Object|Array} data - Data yang dikembalikan
 * @param {number} statusCode - HTTP status code
 * @param {Object} meta - Metadata pagination
 */
const success = (res, message = 'Berhasil', data = null, statusCode = 200, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * @param {Object} res - Express response object
 * @param {string} message - Pesan error
 * @param {number} statusCode - HTTP status code
 * @param {Array} errors - Detail error validasi
 */
const error = (res, message = 'Terjadi kesalahan', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { success, error };
