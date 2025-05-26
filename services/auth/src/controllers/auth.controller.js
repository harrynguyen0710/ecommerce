'use strict'

// success response
const { CREATED, OK, NO_CONTENT } = require('../helpers/success.response');

// auth service
const AuthService = require('../services/auth.service');
const TokenService = require('../services/token.service');

class AuthController {
    async signup(req, res, next) {
        return new CREATED({
            message: 'signed up successfully',
            metadata: await AuthService.signup(req.body)
        }).send(res);
    }

    async login(req, res, next) {
        return new OK({
            message: 'logged in successfully',
            metadata: await AuthService.login(req.body)
        }).send(res);
    }

    async logout(req, res, next) {
        return new NO_CONTENT({
            message: 'logged out successfully',
            metadata: await AuthService.logout(req.body)
        }).send(res);
    }

    async logoutAll(req, res, next) {
        return new NO_CONTENT({
            message: 'logged out from all devices successfully',
            metadata: await AuthService.logoutAll(req.body)
        }).send(res);
    }

    async getAccessToken(req, res, next) {
        return new OK({
            message: 'access token generated successfully',
            metadata: await AuthService.getAccessToken(req.body)
        }).send(res);
    }

    async generateLastingToken(req, res, next) {
        return new CREATED({
            message: 'tokens generated successfully',
            metadata: TokenService.generateTokens(req.params.id, '90d', '90d')
        }).send(res);
    }
}

module.exports = new AuthController();
