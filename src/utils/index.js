'use strict'

const { mongoose } = require('mongoose');

const convertToObjectIdMongodb = (id) => {
    return new mongoose.Types.ObjectId(id);
}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]));
}


module.exports = {
    convertToObjectIdMongodb,
    getSelectData,
    unSelectData,
}