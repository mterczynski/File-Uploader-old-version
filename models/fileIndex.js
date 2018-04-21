const helpers = require('./helpers');
const mongoose = require('mongoose');
// Schema:
const fileIndexSchema = mongoose.Schema({
    index:{type:Number, default:0}
},{
    capped: {max: 1}
});
// Model:
const FileIndex = module.exports = mongoose.model('FileIndex', fileIndexSchema);
// Model methods:
module.exports.createIfDoesntExist = () =>{
    return new Promise((resolve,reject)=>{
        helpers.count(FileIndex).then((resolved)=>{
            if(resolved == 0){
               FileIndex.create({},(err)=>{
                   if(err){
                       reject(err);
                   } else{
                       resolve({success: 'FileIndex created'});
                   }
               });
            } else {
                FileIndex.find({},(err,data)=>{
                    resolve({success:'FileIndex exist: ' + data});
                });
            }
        }).catch((error)=>{
            reject(error);
        });
    })
}
module.exports.getAndIncrement = () => { // only way to make sure that index will be unique for every thread
    return new Promise((resolve,reject)=>{
        FileIndex.findOneAndUpdate({}, { $inc: { index: 1 }}, (err, doc, res)=>{
            if(err){
                reject(err);
            } else {
                resolve(doc.index);
            }
        });
    });
}
// module.exports.get = ()=>{
//     return new Promise((resolve,reject)=>{
//         FileIndex.find({},(err,response)=>{
//             if(err){
//                 reject(err);
//                 return;
//             }
//             if(response.length == 0){
//                 reject({error:'no fileIndex found!'});
//                 return;
//             }
//             resolve(response[0].index);
//         })
//     });
// }
// module.exports.increment = ()=>{
//     return new Promise((resolve,reject)=>{
//         FileIndex.findOneAndUpdate({}, { $inc: { index: 1 }}, (err, doc, res)=>{
//             if(err){
//                 reject(err);
//             } else {
//                 resolve({success: 'File index incremented'});
//             }
//         });
//     });
// }