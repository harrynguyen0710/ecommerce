const syncAttributes = (variants) => {
    const colorSet = new Set();
    const sizeSet = new Set();

    for (const v of variants) {
        colorSet.add(v.color);
        sizeSet.add(v.size);
    }

    return { colorSet, sizeSet };


}

module.exports = {
    syncAttributes,
}