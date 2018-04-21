const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const fileSchema = mongoose.Schema({
    name: {type: String, required: true},
    tags: {type: [String], default:[]},
    uploadDate: {type:Number,  default: new Date().getTime(), min:0},
    downloadCount: {type:Number, default:0, min:0},
    size: {type: Number, min:0, required: true},
    extension: {type:String, default:''},
    path: {type:String, required:true},
    // New, not tested:
    comments: {
        type: [{
            message:{type:String, required:true},
            whenAdded:{type:Number, default:new Date().getTime()},
            authorNick:{type:String, required:true}
        }],
        default:[]
    },

    uploaderNick: {type:String, default:'anon'} // anon == no author, anonymous upload
});

const FileModel = module.exports = mongoose.model('File', fileSchema);

module.exports.incrementDownloadCountByOne = (nameOfFile)=>{
    return FileModel.findOneAndUpdate({name: nameOfFile}, { $inc: { downloadCount: 1 }});
}
// TODO fix
module.exports.getTagsPopularity = ()=>{
    return new Promise((resolve,reject)=>{
        const query = FileModel.find({}).select("tags -_id");
        query.exec(function callback(error,data){
            if(error){
                reject(error);
            } else{
                const tagsUsage = {};
                //resolve(data);
                data.map((el)=>{
                    el.tags.map((tag)=>{
                        if(tagsUsage[tag]){
                            tagsUsage[tag] += 1;
                        }else{
                             tagsUsage[tag] = 1;
                        }    
                    });
                });
                resolve(tagsUsage);
            }
        });
    })
}
module.exports.getFiles = () =>{
    return new Promise((resolve,reject)=>{
        FileModel.find({}, '-_id -__v', function callback(error,data){
            if(error){
                reject(error);
            } else{
                resolve(data);
            }
        });
    })
}
module.exports.validateFiles = () =>{
    return new Promise((resolve,reject)=>{
        FileModel.find({},(error,filesInDB)=>{
            if(error){
                reject(error);
                return;
            }
           
            fs.readdir(path.join(__dirname, './../share'), (error, filesInShare) => {
                // Validate files from DB:

                let removedFromDBCount = 0;
                filesInDB.forEach((fileInDB)=>{
                    if(!filesInShare.includes(fileInDB.path.split("share/")[1])){
                        fileInDB.remove();
                        removedFromDBCount++;
                    }
                });

                // Validate files from share:

                let removedFromShareCount = 0;
                let pathsInDB = [];
                for(let i=0; i<filesInDB.length; i++){
                    pathsInDB.push(filesInDB[i].path);
                }

                for(let i=0; i<filesInShare.length; i++){
                    if(filesInShare[i] == ".gitignore"){
                        continue;
                    }
                    if(!pathsInDB.includes("share/"+filesInShare[i])){
                        // delete file from share(except .gitignore):
                        try{
                            fs.unlink(path.join(__dirname, `./../share/${filesInShare[i]}`),function callback(){});
                            removedFromShareCount += 1;
                        }catch(ex){
                            reject(new Error(`Couldn't remove file named "${filesInShare[i]}" from share`));
                        }
                    }
                }
                resolve({success:"Files validated.",removed:{fromDB: removedFromDBCount, fromShare: removedFromShareCount}});
            });
        });
    });
}
module.exports.addFile = (fileModel) => {
    return new Promise((resolve,reject)=>{
        if(helpers.validateModel(fileModel)){
            helpers.insertOne(fileModel).then((resolved)=>{
                resolve(resolved);
            }).catch((exception)=>{
                reject(exception);
            });
        } else {
            reject(new Error("Not able to validate files"));
            return;
        }
    });
}