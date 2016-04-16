var defaultKeys = require('./defaultKeys.js');
var AES = require('./aes.js');
var toArray=require('./toArray.js');

module.exports=function(data, nwkSKey, appSKey) {
    data=toArray(data);
    var nwkSKey=nwkSKey || defaultKeys.nwkSKey;
    var appSKey=appSKey || defaultKeys.appSKey;
    var appAES = new AES.AES(appSKey);
    var nwkAES = new AES.AES(nwkSKey);

    // we need to know how many options there are
    var fOptsLen=data[5] & 15;
    var fPort=data[8+fOptsLen];
    var keyAES=fPort ? appAES : nwkAES;

    var decrypted=[];

    var seed=[];
    seed.push(0x01);
    seed.push(0x00, 0x00, 0x00, 0x00);
    seed.push(0x00); // direction uplink
    seed.push(data[1],data[2],data[3],data[4]); //devAddr
    seed.push(data[6],data[7]); //FCntUp
    seed.push(0x00, 0x00); // FCntUp on 16 bits
    seed.push(0x00);

    var frmPayload=data.slice(9+fOptsLen, data.length-4);

    for (var i=0; i<Math.ceil(frmPayload.length/16); i++) {
        seed[15]=(i+1); // the first block is expected to be 1
        var key=keyAES.encrypt(seed);
        for (var j=0+(i*16); j<Math.min(16+(i*16), frmPayload.length); j++) {
            decrypted.push(frmPayload[j] ^ key[j%16]);
        }
    }
    return {
        array: decrypted,
        ascii: AES.util.convertBytesToString(decrypted),
        hex: AES.util.convertBytesToString(decrypted,'hex')
    }
};