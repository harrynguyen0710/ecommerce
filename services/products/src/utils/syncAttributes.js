const syncAttributes = (attributes) => {
    const colorSet = new Set();
    const sizeSet = new Set();
    const materialSet = new Set();
    
    for (const v of attributes) {
        colorSet.add(v.color);
        sizeSet.add(v.size);
        materialSet.add(v.material)
    }

    return { colorSet, sizeSet, materialSet };


}

module.exports = {
    syncAttributes,
}