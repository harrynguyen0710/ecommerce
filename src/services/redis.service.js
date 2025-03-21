'use strict'

const { promisify } = require('util')
const redis = require('redis');
const { resolve } = require('path');
const { reservationInventory } = require('../repositories/inventory.repository');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);  

const accquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3s

    for (let i = 0; i < retryTimes.length; i++) {
        const result = await setnxAsync(key,  expireTime);  

        console.log('result::', result);
        if (result === 1) {
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            });
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve => setTimeout(resolve, 50)));
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
}

module.exports = {
    accquireLock,
    releaseLock,
}
