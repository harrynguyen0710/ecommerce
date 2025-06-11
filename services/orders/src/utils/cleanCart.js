function cleanCart (items, fields) {
    return items.map(item => {
        const cleanedCart = {};
        fields.forEach(field => {
            if (field in item) {
                cleanedCart[field] = field;
            }
        });

        return cleanedCart;
    });
}

module.exports = cleanCart;
