const crypto = require("crypto");

function getPartitionKey(productsChunk) {
  if (!Array.isArray(productsChunk)) {
    throw new Error("❌ Expected an array of products for partition key");
  }

  const combinedSkus = productsChunk
    .flatMap(product => {
      if (!product?.variants || !Array.isArray(product.variants)) {
        throw new Error("❌ Invalid product format: missing variants array");
      }
      return product.variants.map(v => v.sku);
    })
    .join("-");

  return crypto.createHash("sha256").update(combinedSkus).digest("hex");
}

module.exports = getPartitionKey;
