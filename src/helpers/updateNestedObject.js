/*
 const a = {
    c: {
        d: 1
    }
 }


 ==> db.collections.updateOne({
        `c.d`: 1
    })
*/

const updateNestedObject = obj => {
    const finalObject = {}
    Object.keys(obj).forEach( k => {
        if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
            const response = updateNestedObject(obj[k]);
            Object.keys(response).forEach( a => {
                finalObject[`${k}.${a}`] = response[a]
            })
        } else {
            finalObject[k] = obj[k];
        }
    });

    return finalObject;
}
module.exports = updateNestedObject;