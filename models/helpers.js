module.exports = {
    // findFilde(fileModel,filter){
    //     return new Promise((resolve,reject)=>{
    //         fileModel.find(filter,function callback(error,data){
    //             if(error){
    //                 reject(error);
    //             } else{
    //                 resolve(success);
    //             }
    //         });
    //     })
    // },
    count(model){
        return new Promise((resolve,reject)=>{
            model.count({},(err,howMany)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(howMany);
            })
        });
    },
    validateModel(input){
        try{
            error = input.validateSync();
            if(error){
                return false;
            }
            return true;
        }
        catch(exception){
            return false;
        }
    },
    insertOne(data){
        return new Promise((resolve,reject)=>{
            data.save(function callback(error, data, addedCount) {
                if(error){
                    reject(error);
                } else {
                    resolve({success:`Added documents. Count: ${addedCount}`});
                }
            });
        });
    },
}
