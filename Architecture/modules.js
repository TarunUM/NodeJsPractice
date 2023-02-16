// console.log(arguments)
// console.log(require("module").wrapper)

// module.export 
const Cal = require('./test-module1')
const cal1 = new Cal();
console.log(cal1.add(2, 2))

// exports 
const Cal2 = require('./test-module2');
console.log(Cal2.divide(2, 2)+' abc')

const {multi, divide} = require('./test-module2');
console.log(multi(2, 22))


// Caching
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();
/* 
    OUTPUT
-----------------
    Hello from the module  // the module is imported in node's cache memory so it is printing only once
    Log this TEXT 
    Log this TEXT
    Log this TEXT
    
*/