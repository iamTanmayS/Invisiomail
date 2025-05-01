const path = require('path');
const fs = require('fs');
 
const imagePath = path.join(__dirname, './debug.png');
const imageBuffer = fs.readFileSync(imagePath);


console.log(imageBuffer)