'use strict'
const AccessService = require('../services/access.service');
const { CREATED, SuccessResponse, NO_CONTENT } = require('../core/success.response');

class AccessController {
    static signup = async (req, res, next) => {
        new CREATED({
            message: 'Register successfully',
            metadata: await AccessService.signup(req.body),
        }).send(res);
    }

    static login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login successfully',
            metadata: await AccessService.login(req.body),
        }).send(res);
    }

    static refreshAccessToken = async (req, res, next) => {
        const refreshToken = req.headers['authorization']?.split(' ')[1];
        new CREATED({
            message: 'Create successfully',
            metadata: await AccessService.refreshAccessToken(refreshToken),
        }).send(res);
    }

    static logout = async (req, res, next) => {
        const refreshToken = req.headers['authorization']?.split(' ')[1];
        new NO_CONTENT({
            message: 'Logout successfully',
            metadata: await AccessService.logout(refreshToken),
        }).send(res);        
    }

}

module.exports = AccessController;
