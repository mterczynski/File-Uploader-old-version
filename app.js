const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const randomToken = require('random-token');
const validateTags = require('./tagValidation.js');
const colors = require('colors');

const config = require('./config');
const Models = require('./models/index');

const fileUploadService = require('./modules/fileUpload');

mongoose.connect(config.database);
mongoose.Promise = global.Promise;
mongoose.connection.on("connected",()=>{
    console.log(('Connected to database ' + config.database).yellow);
});
mongoose.connection.on("error",(error)=>{
    throw error;
});

const app = express();
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
app.set('socketio', io); // new - socket.io
app.set('server', server); // new - socket.io

io.on("connection", function (client) 
{    
    client.on("getListOfFiles",()=>{
        Models.file.getFiles().then((resolved)=>{
            client.emit("getListOfFiles",resolved);
        }).catch((error)=>{
            console.log(error);
        });
    });
    client.on("getTagsPopularity",(data) => {
        Models.file.getTagsPopularity().then((resolved)=>{
            client.emit("getTagsPopularityResponse",resolved);
        }).catch((error)=>{
            console.log(error);
        });
    });
    client.on('startUpload', fileUploadService.onStartUpload);
    client.on('upload', fileUploadService.onUpload);
});
app.use((req,res,next)=>{
    if(!req.url.startsWith("/share/")){
        return next();
    }
    try {
        const reqPath = req.url.slice(7).replace(/%20/g," ");
        fs.statSync("./share/" + reqPath);
        Models.file.incrementDownloadCountByOne(reqPath).then((resolved)=>{
           // console.log(resolved);
        }).catch((error)=>{
            console.log(error);
        });
    }
    catch (e) {
        console.log("File does not exist.");
    }
    next();
});
// CORS Middleware:
app.use(cors());

// Set static folder:
app.use("/",express.static(path.join(__dirname, 'public')));
// Set share folder:
app.use("/share", express.static(path.join(__dirname, 'share')));

// Body Parser Middleware:
app.use(bodyParser.json());

// 404 - no route matched:
app.use((req,res)=>{
    res.status(404).send('404 - file not found');
});

app.get('server').listen(config.serverPort, config.ipOrDomainName);
console.log("========= Restarting server =========".cyan);
console.log(`Server listening on ${config.ipOrDomainName}:${config.serverPort}`.yellow);

(function unitTests(){
    Models.file.validateFiles().then((resolved)=>{
        console.log(resolved)
    }).catch((error)=>{
        console.log("Error: ", error);
    });
    Models.fileIndex.createIfDoesntExist().then((resolved)=>{
        console.log(resolved);
        Models.fileIndex.getAndIncrement().then((resolved)=>{
        }).catch((err)=>{
            console.log(err);
        });
    }).catch((err)=>{
        console.log(err);
    });
})();
