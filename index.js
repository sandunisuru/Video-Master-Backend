const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var ytdl = require('youtube-dl');
var cors = require('cors')
app.use(cors())

app.listen(port, function () {

    console.log("Listening to Port " + port);
});

app.post('/video', (req, res) => {
    var url = req.body.url, formats = [];
    var source = '';
    var thumbnails = '';


    if(url.includes("youtube") || url.includes("youtu.be")){
        source = 'youtube';
    }else if(url.includes("facebook")){
        source = 'facebook';
    }else if(url.includes("vimeo")){
        source = 'vimeo';
    }else{
        source = 'unknown';
    }

    ytdl.getInfo(url, (err, info) => {
        if (err) {
            res.send({ error: 'The link you provided either not a valid url or it is not acceptable' })
        }else{
            thumbnails = info.thumbnails[0].url
            info.formats.forEach(function (item) {
                if (item.format_note !== 'DASH audio' && item.format_note !== 'DASH video') {
                    item.filesize = item.filesize ? bytesToSize(item.filesize) : '';
                    formats.push(item);
                }
            });
            
            console.log(info)
    
            res.send({meta: {id: info.id, source: source, title:info.fulltitle, duration: info._duration_hms,  thumbnails: thumbnails, formats: formats.reverse()}});
    
        }

        
    })
})


function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

app.get('/ping', (req, res) => {

    res.send("Hello");
})