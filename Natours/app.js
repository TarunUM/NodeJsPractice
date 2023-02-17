const express = require('express')

const app = express();

app.get('/', (req, res) => {
    // res.status(200).send("hello from the server side!");
    res.status(200).json({message : 'hello from the server side!', app : "Natours"})
})

app.post(`/`, (req, res) => {
    res.send('got message You can post to this endpoints...')
})

const port = 8000;
app.listen(port, () => {
    console.log(`App running on ${port}...`)
})