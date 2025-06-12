const REDIS = {
    LOCK_TTL: 6000,
};

const CONSUMER_GROUP = {
    CART: "cart-consumer-group",
    CLEAN_CART: "cart-clean-group",
}

module.exports = {
    REDIS,
    CONSUMER_GROUP,
    
}