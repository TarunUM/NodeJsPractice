const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent');


// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed ${data}`);

//   // Callback (hell) method
// //   superagent
// //     .get(`https://dog.ceo/api/breed/${data}/images/random`)
// //     .end((err, res) => {
// //       if (err) return console.log(err.message);
// //       console.log(res.body.message);

// //       fs.writeFile('dog-img.txt', res.body.message, (err) => {
// //         console.log('Random dog image saved to the file');
// //       });
// //     });

//   // promise method
//     // get is also a promise method
//     // i.e. it will give an output at the end either way (promises return)
//     // once its ready it immidiately return values
//     // pending and resolved promises
//     superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then(res => {
//         fs.writeFile('dog-img.txt', res.body.message, (err) => {
//             console.log('Random dog image saved to the file');
//           });
//     }).catch(err => {
//         if (err) return console.log(err.message);
//         console.log(res.body.message);

//     });
// });

// -----------------------------------
// Creating Our Own Promises - 👌👌👌
// -----------------------------------

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err,data) => {
            if (err) reject('I could not find the file');
            resolve(data);
        })
    })
}

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data , err => {
            if  (err) reject('Could not write the file 😁');
            resolve('success');
        })
    })
}


/* // Using then catch method 
readFilePro(`${__dirname}/doggg.txt`).then( data => {
    console.log(`Breed ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
}).then(res => {
    console.log(res.body.message)
    return writeFilePro('dog-img.txt', res.body.message)
}).then( () => {
    console.log('Random dog image saved to the file')
}).catch(err =>{
    console.log(err)
})

*/


// Using Aysmc Awaits
/*
const getDogPic = async() => {
    try{
        // getDogBreed
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed ${data}`);

        // Get Respond from server
        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message)

        // Write that respond into the file
        await writeFilePro('dog-img.txt', res.body.message);
        console.log('Random dog image saved to the file')
    } catch (err) {
        console.log(err)
        throw(err)
        // return err
    }
    return 'completed this function '
}
*/

const get3DogPic = async() => {
    try{
        // getDogBreed
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed ${data}`);

        // Get Respond from server
        const res1 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res4 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res5 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        

        // Instead of await function for all 3 'GET' method we can use promise.all array 
        // which will result all 3 get function to run at the same time
        const resAll = await Promise.all([res1,res2,res3,res4,res5]);
        const imgs = resAll.map(el => el.body.message);
        console.log(imgs);

        // Write that respond into the file
        await writeFilePro('dog-img.txt', imgs.join('\n'));
        console.log('Random dog image saved to the file')
    } catch (err) {
        console.log(err)
        throw(err)
        // return err
    }
    return 'completed this function '
}




// using aync await function 
console.log('1. will get dog pics'); // ";" is imp if we are using () function 
(async () => {
    try{
        console.log('1. will get dog pics')
        const x = await get3DogPic();
        console.log('2.'   + x);
        console.log('3. got dog pics')
    }catch (err){
        console.log("Error Occured 💥")
    }
})(); // (async () => {}))(); it means we are creating a function and call it back at the same moment 

// using then catch method
/* 
    console.log('1. will get dog pics')
    getDogPic().then(x => {
        console.log(x);
        console.log('3. got dog pics')
    }).catch(err => {
        console.log("Error Occured 💥")
    });
*/