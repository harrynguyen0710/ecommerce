'use strict'

// required modules
const prisma = require('../configs/prismaClient');
const bcrypt = require('bcrypt');

// services
const TokenService = require('./token.service');

// status codes
const { BadRequestError, ForbiddenError } = require('../helpers/errors.response');  

class AuthService {
    static async signup (data) {
        const { email, password } = data;
        
        if (!email.trim() || !password.trim()) {
            throw new BadRequestError('Email and password are required!');
        }

        // check if email is already in use
        const isExistingUser = await prisma.users.findUnique({
            where: { email}
        });

        if (isExistingUser) {
            throw new BadRequestError('Email already in use!');
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user
        const user = await prisma.users.create({
            data:{
                email,
                password: hashedPassword,
            }
        });

        if (!user) {
            throw new BadRequestError('Something went wrong!');
        }

        return user.email;
    }

    static async login (data) {
        const { email, password, deviceId } = data;

        if (!email.trim() || !password.trim()) {
            throw new BadRequestError('Email and password are required!');
        }

        // check if user exists
        const user = await prisma.users.findUnique({
            where: { email},
            include: {
                sessions: true
            }
        });

        if (!user) {
            throw new BadRequestError('Invalid credentials!');
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestError('Invalid credentials!');
        }

        // generate tokens
        const { accessToken, refreshToken } = TokenService.generateTokens(user.id);

        // store refresh token per device or create a new one if it doesn't exist
        await TokenService.storeRefreshToken(user.id, refreshToken, deviceId);
       
        return {
            accessToken,
            refreshToken,
        };
    }

    static async logout (data) {
        const { userId, deviceId, refreshToken } = data;
        
        // set blacklisted token
        await TokenService.setBlacklistToken(refreshToken);

        // delete refresh token
        await TokenService.deleteRefreshToken(userId, deviceId);    
    
        return;
    }

    static async logoutAll (data) {
        const { userId } = data;
        
        // delete all in Redis & Database & update blacklist
        await TokenService.deleteAllRefreshTokens(userId);
    }

    static async getAccessToken (data) {
        const { refreshToken, userId, deviceId } = data;

        const isValid = await TokenService.validateRefreshToken(userId, deviceId, refreshToken);

        if (!isValid) {
            throw new ForbiddenError('Forbidden!');
        }

        const accessToken = TokenService.generateAccessToken(userId);

        if (!accessToken) {
            throw new BadRequestError('Something went wrong!');
        }

        return accessToken;
    }

}

module.exports =  AuthService;