'use strict'

// redis + prisma
const redis = require('../configs/redis');
const prisma = require('../configs/prismaClient');

// needed packages
const jwt = require('jsonwebtoken');

class TokenService {

    static generateTokens = (userId) => {
        const accessToken = jwt.sign({ userId }, process.env.PRIVATE_KEY_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId }, process.env.PRIVATE_KEY_SECRET, { expiresIn: '7d' }); 
        return { accessToken, refreshToken };
    }
    
    static generateAccessToken = (userId) => {
        return jwt.sign({ userId }, process.env.PRIVATE_KEY_SECRET, { expiresIn: '1d' });
    }

    static async storeRefreshToken(userId, refreshToken, deviceId) {
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days 

        await redis.set(
            `refresh:${userId}:${deviceId}`,
            refreshToken,
            'EX', 7 * 24 *60 * 60 // 7 days 
        );

        await prisma.sessions.upsert({
            where: { deviceId },
            update: { refreshToken, expiresAt },
            create: {
                refreshToken,
                deviceId,
                userId,
                expiresAt,
            }
        });
    }

    static async validateRefreshToken(userId, deviceId, refreshToken) {
        
        // check if the token is blacklisted
        const isBlacklisted = await this.isTokenBlacklisted(refreshToken);
        
        if (isBlacklisted) {
            return false;
        }

        // check if the token is stored in redis
        const storedRefreshToken = await redis.get(`refresh:${userId}:${deviceId}`);

        if (refreshToken === storedRefreshToken) {
            return true;
        }

        // if not found, check in the database
        const session = await prisma.sessions.findUnique({
            where: { deviceId }
        });

        if (!session || session.refreshToken !== refreshToken) {
            return false;
        }

        return new Date(session.expiresAt) > new Date(); // check if the token is expired in the database
    }

    static async getRefreshToken(userId, deviceId) {
        const refreshToken = await redis.get(`refresh:${userId}:${deviceId}`);
    
        if (refreshToken) {
            const isBlacklisted = await this.isTokenBlacklisted(refreshToken);
            
            // refresh token is blacklisted 
            if (isBlacklisted) {
                return null;
            }
        }
        
        return refreshToken;
    }

    static async isTokenBlacklisted(token) {
        return await redis.get(`blacklist:${token}`);
    }

    static async deleteRefreshToken(userId, deviceId) {
        // delete from redis
        await redis.del(`refresh:${userId}:${deviceId}`);
        
        // delete from database
        await prisma.sessions.deleteMany({
            where: { deviceId }
        });
    }

    static async deleteAllRefreshTokens(userId) {

        // fetch all sessions of the user from database
        const sessions = await prisma.sessions.findMany({
            where: { userId },
            select: { deviceId: true, refreshToken: true }
        });

        // remove all sessions from redis
        const redisCommands = sessions.map(session => 
            redis.del(`refresh:${userId}:${session.deviceId}`)
        );

        console.log('redis commands::', redisCommands);
        await Promise.all(redisCommands);

        // set blacklisted tokens
        const blacklistCommands = sessions
            .filter(session => session.refreshToken)
            .map(session =>
                redis.set(
                    `blacklist:${session.refreshToken}`,
                    'true',
                    'EX', 7 * 24 * 60 * 60 // 7 days
                )
            );

        await Promise.all(blacklistCommands);

        console.log('blacklist command::', blacklistCommands);

        // remove all sessions from database
        await prisma.sessions.deleteMany({ where: { userId } });

    }

    static async setBlacklistToken(token) {
        await redis.set(
            `blacklist:${token}`,
            'true',
            'EX', 7 * 24 * 60 * 60 // 7 days
        );
    }




}

module.exports = TokenService;