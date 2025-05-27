function validateDiscountInput(payload) {
  const { code, type, value, startDate, endDate, applicableSkus } = payload;

  if (!code || !type || !value || !startDate || !endDate) {
    throw new Error("Missing required fields");
  }

  if (type === "PERCENTAGE" && value > 100) {
    throw new Error("Percentage discount cannot exceed 100%");
  }

  if (applicableSkus && !Array.isArray(applicableSkus)) {
    throw new Error("applicableSkus must be an array");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid date format");
  }

  if (start >= end) {
    throw new Error("Start date must be before end date");
  }

  return { start, end };
}


module.exports = validateDiscountInput;