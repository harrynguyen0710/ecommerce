function transformRow(row) {
  let attributes = {};
  let variants = [];
  let tags = [];

  try {
    attributes = JSON.parse(row.attributes || '{}');
  } catch {
    console.warn(`⚠️ Failed to parse attributes for product: ${row.title}`);
  }

  try {
    variants = JSON.parse(row.variants || '[]');
  } catch {
    console.warn(`⚠️ Failed to parse variants for product: ${row.title}`);
  }

  try {
    tags = Array.isArray(row.tags)
      ? row.tags
      : JSON.parse(row.tags || '[]');
  } catch {
    tags = [];
  }

  return {
    productId: row.productId,
    title: row.title,
    description: row.description,
    brand: row.brand,
    category: row.category,
    tags,
    attributes,
    variants,
    status: row.status || 'active',
  };
}

module.exports = transformRow;
