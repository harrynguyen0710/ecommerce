'use strict'
const { generateKeyPairSync } = require('crypto');
const jwt = require('jsonwebtoken');

const createPairOfToken = ({ payload, keySecret }) => {
    const accessToken = jwt.sign(payload, keySecret, {
        algorithm: 'RS256',
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, keySecret, {
        algorithm: 'RS256',
        expiresIn: '7d',
    });

    return { accessToken, refreshToken }
}

const createAccessToken = ({ payload, keySecret }) => {
    const accessToken = jwt.sign(payload, keySecret, {
        algorithm: 'RS256',
        expiresIn: '15m',
    });
    
    return accessToken;
}

const getPrivateKey = () => {
    const privateKey = process.env.PRIVATE_KEY_SECRET.replace(/\\n/g, '\n'); // Convert `\n` to actual newlines
    return privateKey;
}

const getPublicKey = () => {
    const publicKey = process.env.PUBLIC_KEY_SECRET.replace(/\\n/g, '\n');
    return publicKey;
}

const generateRSAKey = () => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return { publicKey, privateKey };
};

const verifyToken = async (token, keySecret) => {
    return jwt.verify(token, keySecret);
}

module.exports = {
    createPairOfToken,
    generateRSAKey,
    verifyToken,
    getPrivateKey,
    getPublicKey,
    createAccessToken,
}