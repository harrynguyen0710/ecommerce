'use strict'

const { BadRequestError, ForbiddenError } = require('../core/error.response');
const shopService = require('./shop.service');
const shopModel = require('../models/shop.model');
const role = require('../enum/role');
const bcrypt = require('bcrypt');
const authUlti = require('../auth/authUtils');
const keyTokenService = require('./keyToken.service');
const keyTokenModel = require('../models/keyToken.model');

class AccessService {
    static async refreshAccessToken( refreshToken ) {
        // get public key from env
        const publicKey = authUlti.getPublicKey();
        
        // verify token
        const data = await authUlti.verifyToken(refreshToken, publicKey);

        // get user
        const user = await shopModel.findById(data.userId);
        const userToken = await keyTokenService.getRefreshTokenByUserId(data.userId);

        if (!user || userToken.refreshToken !== refreshToken) {
            throw new ForbiddenError('Error: Something went wrong');
        }

        // get private key from env
        const keySecret = authUlti.getPrivateKey();

        // generate access token
        const accessToken = authUlti.createAccessToken({ payload: { userId:  data.userId }, keySecret });

        return accessToken;
    }

    static async signup({ name, email, password }) {
        const isEmailExist = await shopService.checkEmailExist({ email });
                    
        if (isEmailExist) {
            throw new BadRequestError('Error: Account already exists');
        }

        const newShop =  await shopService.createShop({ email, password, name, roles: [role.SHOP]});

        return newShop;
    }
    
    static async login({ email, password, refreshToken = null }) {

        const shop = await shopService.findByEmail({ email });

        // if the email doesn't exist in the db
        if (!shop) {
            throw new BadRequestError('Error: Invalid crendentials');
        }

        // check whether the password matches
        const isPasswordMatches =  bcrypt.compareSync(password, shop.password);

        if (!isPasswordMatches) {
            throw new BadRequestError('Error: Invalid crendentials');
        }

        // get private key
        const privateKey = authUlti.getPrivateKey();

        // create access and refresh token
        const tokens = authUlti.createPairOfToken({ payload: { userId: shop._id }, keySecret: privateKey });

        // update new token to the database
        keyTokenService.updateKeyToken({ shopId: shop._id , tokens });

        return { 
            tokens        
        }

    }

    static async logout( refreshToken ) {
        if (!refreshToken) {
            throw new BadRequestError('Something went wrong!');
        }

        const publicKey = authUlti.getPublicKey();

        const data = await authUlti.verifyToken(refreshToken, publicKey);

        if (!data) {
            throw new ForbiddenError('Something went wrong!');
        }

        const result = await keyTokenService.removeRefreshToken(data._id);
        return result;
    }

    
    
    
}

module.exports = AccessService;