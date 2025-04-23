const express = require("express");
var nodemailer = require("nodemailer");
var axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var ytdl = require("youtube-dl");
var cors = require("cors");
app.use(cors());
require('dotenv').config();

var YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Username",
    pass: "Key"
  }
});

app.listen(port, function() {
  console.log("Listening to Port " + port);
});

app.post("/ext_video", (req, res) => {
  var url = req.body.url,
    formats = [];
  var source = "";
  var thumbnails = "";

  if (url === "") {
    console.log("Empty URL Request Failed");
    res.send("URL not found");
  } else {
    if (url.includes("youtube") || url.includes("youtu.be")) {
      source = "youtube";
    } else if (url.includes("facebook")) {
      source = "facebook";
    } else if (url.includes("vimeo")) {
      source = "vimeo";
    } else if (url.includes("pornhub")) {
      source = "pornhub";
    } else {
      source = "unknown";
    }

    try {
      ytdl.getInfo(url, (err, info) => {
        if (err) {
          res.send({
            error:
              "The link you provided either not a valid url or it is not acceptable"
          });
        } else {
          thumbnails = info.thumbnails[0].url;
          info.formats.forEach(function(item) {
            if (
              item.format_note !== "DASH audio" &&
              item.format_note !== "DASH video"
            ) {
              item.filesize = item.filesize ? bytesToSize(item.filesize) : "";
              formats.push(item);
            }
          });

          res.send({
            meta: {
              id: info.id,
              source: source,
              title: "Video",
              duration: info._duration_hms,
              thumbnails: thumbnails,
              formats: formats.reverse()
            }
          });
        }
      });
    } catch (e) {
      res.send({
        error:
          e.message
      });
    }
  }
});

app.post("/video", (req, res) => {
  var url = req.body.url,
    formats = [];
  var source = "";
  var thumbnails = "";

  if (url.includes("youtube") || url.includes("youtu.be")) {
    source = "youtube";
  } else if (url.includes("facebook")) {
    source = "facebook";
  } else if (url.includes("vimeo")) {
    source = "vimeo";
  } else if (url.includes("pornhub")) {
    source = "pornhub";
  } else {
    source = "unknown";
  }

  try {
    ytdl.getInfo(url, (err, info) => {
      if (err) {
        res.send({
          error:
            "The link you provided either not a valid url or it is not acceptable"
        });
      } else {
        axios
          .get(
            "https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" +
              info.id +
              "&key=" + YOUTUBE_API_KEY
          )
          .then(result => {
            thumbnails = info.thumbnails[0].url;
            info.formats.forEach(function(item) {
              if (
                item.format_note !== "DASH audio" &&
                item.format_note !== "DASH video"
              ) {
                item.filesize = item.filesize ? bytesToSize(item.filesize) : "";
                formats.push(item);
              }
            });

            res.send({
              meta: {
                id: info.id,
                source: source,
                title: result.data.items[0].snippet.title,
                duration: info._duration_hms,
                thumbnails: thumbnails,
                formats: formats.reverse()
              }
            });
            //res.send(info)
          });
      }
    });
  } catch (e) {
    res.send({
      error: e.message
    });
  }
});

app.post("/report", (req, res) => {
  let message = req.body.message;

  var mailOptions = {
    from: "From Email",
    to: "To Email",
    subject: "VideoMaster Error Reporting",
    text: message
  };

  try{
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.send({ status: 501, message: error });
        console.log(error);
      } else {
        res.send({ status: 200, message: "Error Reported!" });
      }
    });
  }catch(e){
    res.send({ status: 200, message: e.message });
  }
  
});

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
