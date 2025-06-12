const INVENTORY_DEFAULT = {
    QUANTITY: 0,
    RESERVED: 0,
    STATUS: "AVAILABLE",
};

const SERVICE_INFOR = {
    NAME: "inventory-service",
    EVENT: "product.created",
};

const KAFKA_HEADERS = {
  CORRELATION_ID: "x-correlation-id",
  START_TIMESTAMP: "x-start-timestamp",
};

const GROUP_CONSUMERS = {
    INVENTORY_GROUP: "inventory-group",
    INVENTORY_BULK_CONSUMER_GROUP: "inventory-bulk-consumer",
    INVENTORY_UPDATE_ORDER_CREATED: "inventory-update-order-created",
};

const LIMIT = {
    RETRIES: 5,
};


module.exports = {
    INVENTORY_DEFAULT,
    SERVICE_INFOR,
    KAFKA_HEADERS,
    LIMIT,
    GROUP_CONSUMERS,
}