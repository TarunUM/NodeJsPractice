// Node makes use of only one thread (Single Thread) no matter the users number
    // because of this structure blocking of thread can be a problem 
    // we can assign complex operation to diff. thread too.
    // i.e. additionally there are 4 more thread provide to make use of.



//     CYCLE OF EVENTLOOP 
//         - it makes use Queue Structure to it
// 1. start
// 2. Expired Timer Callbacks
// 3. I/O polling and Callbacks
// 4. setImmediate Callbacks
// 5. close Callbacks
//    other :- process.nextTick and other Microtask queues


const fs = require('fs');
const crypto = require('crypto');
const start = Date.now();
process.env.UV_THREADPOOL_SIZE=1;

setImmediate(()=> console.log('hello 1st Immidiate'));
setTimeout(() => console.log('Hello 1st timer'),0);
setTimeout(() => console.log('Hello 2nd timer'),3000);

const data = fs.readFile("../First/IDGAF.txt", 'utf-8' ,(err, data)=>{
    console.log('Hello I/O Finished');
    // console.log(data);
    console.log('------------------------');


    setTimeout(() => console.log('Hello 3rd timer'),0);
    setTimeout(() => console.log('Hello 4th timer'),3000);
    
    // setImmediate gets executed once this tick that's whole phase (cycle of event loop)
    setImmediate(()=> console.log('hello 2nd Immidiate'));

    // process.nextTick executed after each phase 
    process.nextTick(()=> {console.log('Hello process.nextTick')})

    crypto.pbkdf2('password ', 'salt', 100000, 1024, 'sha512', ()=>{
        console.log(Date.now() - start , " - Password Encrypted");
    })
    crypto.pbkdf2('password ', 'salt', 100000, 1024, 'sha512', ()=>{
        console.log(Date.now() - start , " - Password Encrypted");
    })
    crypto.pbkdf2('password ', 'salt', 100000, 1024, 'sha512', ()=>{
        console.log(Date.now() - start , " - Password Encrypted");
    })

    // Sync blocks the threadpool eventhough the others execute immidiatly, they have to wait for these lines to execute
    crypto.pbkdf2Sync('password ', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start , " - Password Encrypted23");
    
    
    crypto.pbkdf2Sync('password ', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start , " - Password Encrypted234");
});


console.log("hello from top level Code");

// -- OutPUT --

// hello from top level Code
// Hello 1st timer
// hello 1st Immidiate
// Hello I/O Finished
// ------------------------
// Hello process.nextTick -- // process.nextTick executed after each phase 
// hello 2nd Immidiate -- // the 2nd Immidiate will print before 3rd timer because "I/O polling and callback" 
                          // after polling it hold on Immidiate callback phase
// Hello 3rd timer
// Hello 2nd timer
// Hello 4th timer

// 123