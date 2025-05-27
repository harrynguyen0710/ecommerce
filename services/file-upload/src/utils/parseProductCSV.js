function parseCsvRowToProduct(row) {
  try {
    const product = {
      productId: row.productId,
      title: row.title,
      description: row.description,
      brand: row.brand,
      category: row.category,
      tags: JSON.parse(row.tags),
      attributes: JSON.parse(row.attributes),
      variants: JSON.parse(row.variants),
      status: row.status || "active",
    };

    const isValid =
      product.title &&
      Array.isArray(product.variants) &&
      product.variants.length > 0 &&
      product.variants.every((v) => v.sku && v.color && v.size && v.price);

    if (!isValid) {
      throw new Error("Product row is structurally invalid");
    }

    return product;
  } catch (err) {
    console.warn("⚠️ Skipping invalid product row:", row);
    console.error("🛑 Parse error:", err.message);
    return null;
  }
}

module.exports = parseCsvRowToProduct;
