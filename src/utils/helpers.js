/**
 * Helper utility functions
 */

/**
 * Create standardized success response
 */
const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Create standardized error response
 */
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Pagination helper
 */
const getPagination = (page, limit) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  return {
    limit: parsedLimit,
    offset,
  };
};

/**
 * Get pagination metadata
 */
const getPaginationMeta = (count, page, limit) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;

  return {
    currentPage: parsedPage,
    totalPages: Math.ceil(count / parsedLimit),
    totalItems: count,
    itemsPerPage: parsedLimit,
    hasNextPage: parsedPage < Math.ceil(count / parsedLimit),
    hasPreviousPage: parsedPage > 1,
  };
};

/**
 * Sanitize user input - remove HTML tags
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.replace(/<[^>]*>/g, "");
};

/**
 * Format date to readable string
 */
const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

module.exports = {
  successResponse,
  errorResponse,
  getPagination,
  getPaginationMeta,
  sanitizeInput,
  formatDate,
};
