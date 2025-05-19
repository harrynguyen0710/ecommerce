const syncAttributes = (variants) => {
    const colorSet = new Set();
    const sizeSet = new Set();

    for (const v of variants) {
        colorSet.add(v.color);
        sizeSet.add(v.size);
    }

    return {
        color: Array.from(colorSet),
        size: Array.from(sizeSet),
    };

}

module.exports = {
    syncAttributes,
}