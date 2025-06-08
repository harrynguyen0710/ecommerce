function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
}

module.exports = calculateTotal;