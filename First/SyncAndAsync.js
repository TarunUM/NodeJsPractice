// Sync And A-Sync Functions

const fs = require('fs');


// Blocking Syncronized way (Blocking Nature) i.e. if a person is trying access the files then all the others should way wait until this process is done :(
const Syncdata = fs.readFileSync('./IDGAF.txt', 'utf-8');
console.log(Syncdata)
console.log(".....Reading File \n");



// Non-Blocking ASyncronized way (Non-Blocking Nature) i.e. Others can perform their task w/o worrying 
fs.readFile('./IDGAF.txt', 'utf-8', (err, data) => {
    console.log(data)
});
// This is the CallBack Function --> (err, data) => {console.log(data)}
// this line will print first because the above line is accessing the data from txt file in background
console.log(".....Reading File");



// CallBack HELL
fs.readFile('./IDGAF.txt', 'utf-8', (err, data) => {
    if(err) return console.log('Error Occured');

    fs.readFile(`./output.txt`, 'utf-8', (err, data2) => {
        console.log(`\n\nCheckin ${data} \n`+data2)
        fs.writeFile('final.txt', `${data}\n${data2}`,'utf-8', err => {
            console.log('File has been written')
        })
    });
});
console.log(".....Reading File");