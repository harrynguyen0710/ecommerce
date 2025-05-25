const handleUndefinedFields = (obj) => {
  if (obj === null || obj === undefined) {
    return {};
  }

  const data = {}

  for (const key in obj) {
    if (obj[key] !== undefined) {
      data[key] = obj[key];
    }
  }
  
  return data;
}

module.exports = handleUndefinedFields;