const color = (n) => {
    let rgbaValues = [];
    let usedColors = new Set();

    while (rgbaValues.length < n) {
        let r = Math.floor(Math.random() * 156) + 100;
        let g = Math.floor(Math.random() * 156) + 100;
        let b = Math.floor(Math.random() * 156) + 100;
        
        let colorKey = `${r},${g},${b}`;
        
        // Check if color already used
        if (!usedColors.has(colorKey)) {
            let createColor = `rgba(${r}, ${g}, ${b}, 1)`;
            rgbaValues.push(createColor);
            usedColors.add(colorKey);
        }
    }
    return rgbaValues;
}

module.exports = color;
