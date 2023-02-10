/* 
*** Event driven Architecture ***
    :- there are mainly 3 components in this 
        1. event emmiter
        --- Emits Events ---
        2. event listener
        --- Calls ---
        3. Attached callback functions
*/


const { time } = require('console');
const MyNewEmmitter = require('events');
const http = require('http')


/* before using 'MyNewEmmitter' as super class */
// const myEmitter = new MyNewEmmitter();

class sales extends MyNewEmmitter{
    constructor(){
        super();
    }
}

/* after extending 'MyNewEmmitter' as super class to sales class
    with that we use super classes methods too*/
const myEmitter = new sales();

myEmitter.on("onSale" , () => {
    console.log('There\'s a new sale going on.')
})

myEmitter.on("onSale" , () => {
    console.log('new sale going on with high discounts.')
})

myEmitter.on("onSale" , (stocks,time) => {
    console.log(`There\'s a new sale going on and ${stocks} at ${time} store.`)
})

myEmitter.on("employee" , () => {
    console.log('employee are needed.')
})

// we can pass arhuments by using " , " / comma symbol 
myEmitter.emit("onSale", 9, 'celine');
myEmitter.emit("employee", 9, 'celine');




//////////////////////////////////////////////

// All the built in modules / events are built on event-driven architecture.
//for ex. http shown below
const server = http.createServer();

server.on("request", (req,res) => {
    console.log("\n"+req.url);
    console.log('Request is received ');
    res.end('Request received')  // It will be showed in browser
})
server.on("request", (req,res) => {
    console.log('Another Request is received \n');
})
server.on("close", (req,res) => {
    console.log('Server is CLosed');
})

// "listen" is same emmit function from events module
server.listen('8000', "127.0.0.1", () => {
    console.log("waiting for requests -----")
} )