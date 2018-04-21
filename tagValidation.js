const colors = require('colors');

module.exports = function validateTags(tags){
    const tagRegExp = /^[a-z1-9]+$/;
    if(!(tags instanceof Array)){
        throw new Error('Validation error: input value is not an array');
    }
    for(let i=0; i<tags.length; i++){
        if(!(tags[i] instanceof String) && typeof tags[i] !== "string"){
            const errorMsg = `Type error: "${tags[i]}" is not a valid tag`;
            throw new Error(errorMsg);
        }
    }
    (function replaceTags(){
        for(let i=0; i<tags.length; i++){
            tags[i] = tags[i].replace(new RegExp("ą","g"), "a")
                .replace(new RegExp("ć","g"), "c")
                .replace(new RegExp("ę","g"), "e")
                .replace(new RegExp("ż","g"), "z")
                .replace(new RegExp("ó","g"), "o")
                .replace(new RegExp("ź","g"), "z")
                .replace(new RegExp("ł","g"), "l")
                .replace(new RegExp(" ","g"), "")    
                .replace(new RegExp("_","g"), "") 
                .replace(new RegExp("-","g"), "")            
                .toLowerCase();
        }
    })();
    for(let i=0; i<tags.length; i++){
        if(!tagRegExp.test(tags[i])){
            throw new Error(`RegExp error: "${tags[i]}" is not a valid tag`);
        } 
    }
}