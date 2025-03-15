'use strict'

const keyTokenModel = require('../models/keyToken.model');

const updateKeyToken = async ({ shopId, tokens }) => {
    const filter = { user: shopId }; // filter criteria
    const update = {
        refreshToken: tokens.refreshToken, 
        refreshTokenedUsed: [],
    } // update fields
    const options = { upsert: true, new: true } // options

    await keyTokenModel.findOneAndUpdate(filter, update, options);

}

const removeRefreshToken = async (shopId) => {
    await keyTokenModel.updateOne(
        { user: shopId }, // filter by user ID
        { refreshToken: "" }, // update the refresh token field
    )
}

const getRefreshTokenByUserId = async (shopId) => {
    const keyTokenData = await keyTokenModel.findOne({ user: shopId }).select('refreshToken -_id').lean();
    return keyTokenData;
}


module.exports = {
    updateKeyToken,
    getRefreshTokenByUserId,
    removeRefreshToken,
}