'use strict'

const prisma = require('../configs/prismaClient');

const updateReFreshToken = async (userId, refreshToken, deviceId) => {
    await prisma.sessions.upsert({
        where: { deviceId },
        update: { refreshToken },
        create: {
            refreshToken,
            deviceId,
            userId: userId ,
        }
    });
}

module.exports = {
    updateReFreshToken,
}