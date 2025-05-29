function transformRow (row) {
    return {
        title: row.title,
        variants: [
            {
                sku: row.sku,
                price: parseFloat(row.price),
                quantity: parseInt(row.quantity),
                color: row.color,
                size: row.size,
            }
        ]
    }
}

module.exports = transformRow;
