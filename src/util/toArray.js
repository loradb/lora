// convert the data to an array


var isArray=require('is-array-type');
var fromBase64=require('./base64ToArray.js');
var fromHex=require('convert-hex').hexToBytes;

module.exports=function(data) {
    if (isArray(data)) return data;

    if (data.match(/^[0-9a-fA-F]*$/)) {
        return fromHex(data);
    }
    return fromBase64(data);
}