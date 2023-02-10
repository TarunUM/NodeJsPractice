const fs = require('fs');

const data = fs.readFileSync('./IDGAF.txt', 'utf-8');

console.log(data)

const textPrint = `This is what we know about the avacado: \n${data}. \t--- Created A new Line ${Date.now()}`;

fs.writeFileSync('./output.txt', textPrint);

console.log(textPrint)