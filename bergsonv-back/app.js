const fs = require('fs');
const express = require('express');
const app = express();

const testFolder = './public/';

const hostname = '127.0.0.1';
const port = 3001;

app.use(express.static('public'));

app.get('/api/albums/', function(req, res) {

    let jsonImage = [];
    fs.readdirSync(testFolder).forEach( file => {
        jsonImage.push(
            {
                title : file,
                src: `http://${hostname}:${port}/${file}`
            }
        );
    })

    const albums = [ {
        name: 'todo récupérer le nom de dossier',
        images: jsonImage
    }]

    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(albums));
});

app.get('/data/', function(req, res) {
    res.send('hello world data');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

