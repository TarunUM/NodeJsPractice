const replacefilmcard =  require('./replacefilmcard.js');
const fs = require('fs');
const http = require('http');
const url = require('url');


const slugify = require('slugify');

// const replacefilmcard = (temp, film) => {
//     let output = temp.replace(/{%filmname%}/g, film.filmname);
//     output = output.replace(/{%id%}/g, film.id);
    
//     output = output.replace(/{%actor%}/g, film.actor);
//     output = output.replace(/{%desc%}/g, film.dc);
//     if(film.dc) output = output.replace(/{%dc%}/g, film.desc);

//     return output;
// }


//Importing Film Html file
const film = fs.readFileSync(`${__dirname}/film.html`,'utf-8');
const filmCard = fs.readFileSync(`${__dirname}/filmCard.html`,'utf-8');
const home = fs.readFileSync(`${__dirname}/home.html`,'utf-8');

// Importing JSON data file 
const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8');
const dataObj = JSON.parse(data);


const slugs = dataObj.map(el => slugify(el.filmname, {lower: true}));
console.log(slugs);

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);

    // const pathName = req.url;
    if(pathname === '/' || pathname === '/home'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        const cardsHtml = dataObj.map( ele => replacefilmcard(filmCard, ele)).join('');
        const output = home.replace('{%filmcards%}',cardsHtml)
        res.end(output);

    } else if(pathname === '/film'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        const filmHtml = dataObj[query.id];
        const replace = replacefilmcard(film,filmHtml)
        res.end(replace);
    } else{
        res.writeHead(200, { 'Content-type': 'text/html'});
        res.end('<h1>Hello From The Server</h1>');
    }
})

server.listen(3000, '127.0.0.1', () => {
    console.log('Project Server is running---');
})