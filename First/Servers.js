const fs = require('fs');

// For handling servers we use HTTP
const http = require('http');

// For routing and handling urls
const url = require('url');

// // Creating Server-End // //
// const server = http.createServer((req, res) => {
//     console.log(req.url);
//     res.end('Hello From The Server');
// })


// We are using Sync Blocking Function for reading the filea beacause we are going to this only one time throughout code i.e. Efficient
const data = fs.readFileSync(`${__dirname}/jsonFiles/data.json`,'utf-8');
const dataObj = JSON.parse(data);

// Working with URL's
const server = http.createServer((req, res) => {
    const pathName = req.url;

    if(pathName === '/' || pathName === '/home'){
        res.end('<h1>This is Home</h1>');
    } else if(pathName === '/products'){
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);
    } else{
        res.end('Hello From The Server');
    }

})


// 127.0.0.1 is localhost default address
server.listen(8000, '127.0.0.1', () => {
    console.log('Server is running.....');
})

