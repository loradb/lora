var defaultKeys = require('./defaultKeys.js');
var aesCmac = require('node-aes-cmac').aesCmac;

module.exports=function(data, nwkSKey) {
    var nwkSKey=nwkSKey || defaultKeys.nwkSKey;

    // the last 4 bytes are expected to be the MIC

    console.log(data);

    var seed=[];
    seed.push(0x49);
    seed.push(0x00, 0x00, 0x00, 0x00);
    seed.push(0x00); // direction
    seed.push(data[1],data[2],data[3],data[4]); //devAddr
    seed.push(data[6],data[7]); //FCntUp
    seed.push(0x00, 0x00); // FCntUp on 16 bits
    seed.push(0x00);
    seed.push(data.length-4);

    for (var i=0; i<data.length-4; i++) {
        seed.push(data[i]);
    }

    var dataBuffer=new Buffer(seed);

    console.log(dataBuffer.length)

    var keyBuffer=new Buffer(nwkSKey);
    var result=aesCmac(keyBuffer, dataBuffer);
    console.log('-------------------')
    console.log(result);
    console.log(new Buffer(data.slice(data.length-4)))
    return true;
}