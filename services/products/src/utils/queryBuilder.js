const builderQuery = (query, allowedFilters = []) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 30;
  const skip = (page - 1) * limit;

  const filters = {};

  for (const key of allowedFilters) {
    const queryValue = getNestedValue(query, key);
    if (queryValue !== undefined) {
      filters[key] = queryValue;
    }
  }

  if (query.search) {
    filters.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  const sortBy = query.sortBy || "createdAt";
  const order = query.order === "asc" ? 1 : -1;

  return { filters, skip, limit, sort: { [sortBy]: order }, page };
};

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};


module.exports = {
  builderQuery,
}