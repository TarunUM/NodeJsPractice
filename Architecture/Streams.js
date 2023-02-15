/* Streams - used to process data peice by peice w/0 completing whole read/write operations, memory efficient
   ex - Youtube , Netflix
   * Streams are Instances of EventEmitter class 
   * it has 4 fundamental types of streams
   they are :-  1. Readable - Stream From which we can read ,
                            ex: http requests, fs read
                            imp events: data, end
                            imp functions: pipe, read 

                2. Writable - Stream to which we can write data
                            ex: http responses, fs write
                            imp events: drain, finish
                            imp functions: write, end 

                3. Duplex - Stream that are both readable and writeable
                            ex: net web socket
                ****  ------  Consume Streams -- These are already Implemented ----- ****

                4. Transform - Duplex streams that modify / transform data as it is written or read
                            ex: zlib GZip creation

*/


const fs = require('fs');
const server = require('http').createServer();

server.on("request", (req, res) => {
   // Solution 1 - Typical way of consuming data
   // const data = fs.readFile('test-file.txt' , (err, data) => {
   //    if(err) console.log("error.")
   //    res.end(data)
   // })

   // Solution 2 - it fast than the typical solution 1
         /* -- In this the readable stream is much faster than the write stream on he network, which will overwhelm
               and it can not handle the income data so fast which leads to backPressure issues.*/
               /* backPressure issues(cannot send the data nearly as fast as it is receiving it).  */
   // const readable = fs.createReadStream('test-file.txt');
   // readable.on('data',  (chunk) =>{
   //    res.write(chunk);
   // })

   // readable.on('end', ()=>{
   //    res.end()
   // })

   // readable.on('error', (chunks)=>{
   //    console.log('error')
   //    res.statusCode = 500;
   //    res.end("File not Found")
   // })

   // Solution 3 - it solves backpressure solution
         /* it allows us to pipe the output of a readable stream to right in to the input of writable stream*/
         /* It is the easiest ways to consuming and writting streams unless we want more complex customization*/
   const readable = fs.createReadStream('test-file.txt');
   readable.pipe(res);
   // /* readableSource.pipe(WritableDest) */

})

server.listen('8000','127.0.0.1', () => {
   console.log('listening on 8000 port.....')
});