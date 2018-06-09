const fs = require('fs');
const express = require('express');
const app = express();

const testFolder = './public/';

const hostname = '127.0.0.1';
const port = 3001;

app.use(express.static('public'));


const walkSync = function(dir, filelist, subfolder = '') {
    let files = fs.readdirSync(dir);

    files.forEach(function(file) {
        if( file[0] !== '.'){
            if (fs.statSync(dir + file).isDirectory()) {
                let folderFilelist = walkSync(dir + file + '/', [], file);
                filelist.push({
                    name: file,
                    images: folderFilelist
                })
            }
            else {
                filelist.push(
                    {
                        title : file,
                        src: subfolder !== '' ? `http://${hostname}:${port}/${subfolder}/${file}` : `http://${hostname}:${port}/${file}`
                    });
            }
        }
    });

    return filelist;
};

app.get('/api/albums/', function(req, res) {

    let filelist = walkSync( testFolder, [] );

    /*let jsonImage = [];
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
    }]*/

    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(filelist));
});

app.get('/data/', function(req, res) {
    res.send('hello world data');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

