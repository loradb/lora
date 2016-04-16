var defaultKeys = require('./defaultKeys.js');
var aesCmac = require('node-aes-cmac').aesCmac;
var toArray=require('./toArray.js');

module.exports=function(data, nwkSKey) {
    data=toArray(data);
    var nwkSKey=nwkSKey || defaultKeys.nwkSKey;
    var seed=[];
    seed.push(0x49);
    seed.push(0x00, 0x00, 0x00, 0x00);
    seed.push(0x00); // direction
    seed.push(data[1],data[2],data[3],data[4]); //devAddr
    seed.push(data[6],data[7]); //FCntUp
    seed.push(0x00, 0x00); // FCntUp on 16 bits
    seed.push(0x00);
    seed.push(data.length-4);
    var allData=seed;

    // the last 4 bytes are expected to be the MIC
    for (var i=0; i<data.length-4; i++) {
        allData.push(data[i]);
    }

    var dataBuffer=new Buffer(allData);
    var keyBuffer=new Buffer(nwkSKey);
    var result=aesCmac(keyBuffer, dataBuffer); // the 4 first bytes should match the mic
    var mic=new Buffer(data.slice(data.length-4)).toString('hex');

    return (mic === result.substring(0,8));
}