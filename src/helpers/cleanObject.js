'use strict'

const cleanObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === "object" && !Array.isArray(obj[k]) && obj[k] !== null) {
            cleanObject(obj[k]); // Recursively clean nested objects
        }
        if (obj[k] == null) {
            delete obj[k]; // Remove null or undefined values
        }
    });

    console.log("object::", obj);
    return obj;
};

module.exports = cleanObject;