const Files = {}; // for handling uploads

module.exports = {
    onStartUpload,
    onUpload
}

function onStartUpload (data) { 
    /*
        data:{
            size:Number,
            name:String,
            tags:String[]
        }
    */ 
    let fileName = data.name;
    let filePath = "";

    // Validate user input:
    let errorReason = null;
    try{
        // validate data.name:
        if(!(fileName instanceof String) && typeof fileName !== "string"){
            throw new Error('Validation error: fileName');
        }
        // validate data.tags:
        validateTags(data.tags); // throws error
        // validate data.size:                                
        if(!(data.size instanceof Number) && typeof data.size !== "number" && data.size<0){
            throw new Error('Validation error: fileSize');
        }
    } catch(ex) {
        console.log("Start upload error, aborting");
        client.emit('startUploadError', ex.message);
        return false;
    }
    
    Models.fileIndex.getAndIncrement().then((index)=>{
        
        filePath = 'share/file' + index; 
        Files[filePath] = {  //Create a new Entry in The Files Variable
            size : data.size,
            data     : "",
            downloaded : 0,
            tags: data.tags,
            handler: null,
            name: fileName,
            extension: fileName.split(".").slice(1).join().replace(/,/g,".")
        }
        let place = 0;
        fs.open(path.join(__dirname, filePath + "." + Files[filePath].extension), "a", 0755, function(err, fd){
            if(err){
                console.log(err);
            }
            else{
                Files[filePath].handler = fd; // We store the file handler so we can write to it later
                client.emit('readyToUpload',{filePath, place});
            }
        });
    }).catch((error)=>{
        console.log(error);
    }); 
}

function onUpload (data){
    /* 
        data:{
            data: String,
            path: String
        }
    */
    let name = data.name;
    if(!name instanceof String && !typeof name == 'string'){
        return;
    }
    let filePath = data.filePath;
    if(!filePath instanceof String && !typeof filePath == 'string'){
        return;
    }
    Files[filePath].downloaded += data.data.length;
    Files[filePath].data += data.data;

    if(Files[filePath].downloaded == Files[filePath].size) { // If file is fully uploaded
        fs.write(Files[filePath].handler, Files[filePath].data, null, 'Binary', function(err, written){
            let toSend = err;
            const uploadDate = new Date().getTime();
            if(!err){
                toSend = {
                    success: `Successfully uploaded file "${name}" to the server.`,
                    written, // fileSize
                    fileName: name,
                    path:filePath+"."+Files[filePath].extension,
                    tags: Files[filePath].tags,
                    uploadDate,
                    extension: Files[filePath].extension
                };
            }
            const fileModel = new Models.file({
                name,
                tags: Files[filePath].tags,
                size:Files[filePath].size,
                date: uploadDate,
                extension: Files[filePath].extension,
                path: filePath + "." + Files[filePath].extension
            });
            Models.file.addFile(fileModel).then((resolved)=>{
                client.emit("finishedUploading",toSend);
                if(toSend.success){
                    // todo broadcast
                    client.broadcast.emit('newFileAdded', toSend);
                }
            }).catch((error)=>{
                console.log(error);
            });
        });
    }
    else if(Files[filePath].data.length > 10485760){ //If the Data Buffer reaches 10MB
        fs.write(Files[filePath].handler, Files[filePath].data, null, 'Binary', function(err, written){
            Files[filePath].data = ""; //Reset The Buffer
            let place = Files[filePath].downloaded / 524288;
            let percent = (Files[filePath].downloaded / Files[filePath].size) * 100;
            client.emit('moreData', { 'Place' : place, 'Percent' :  percent});
        });
    }
    else{
        let place = Files[filePath].downloaded / 524288;
        let percent = (Files[filePath].downloaded / Files[filePath].size) * 100;
        client.emit('moreData', {'Place': place, 'Percent':  percent});
    }
}

