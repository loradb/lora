var defaultKeys=require('./defaultKeys.js');
var checkMIC=require('./checkMIC.js');
var toArray=require('./toArray.js');


const mTypeTexts=[
    'Join Request',
    'Join Accept',
    'Unconfirmed Data Up',
    'Unconfirmed Data Down',
    'Confirmed Data Up',
    'Confirmed Data Down',
    'RFU',
    'Proprietary'
];

var appAES;
var nwkAES;
var result;

module.exports=function(data, options) {
    data = toArray(data);
    var options=options || {};
    var level= isNaN(options.level) ? 2 : options.level ;
    var decrypt = (typeof options.decrypt === 'undefined') ? true : options.decrypt;

    if (! checkMIC(data, nwkSKey)) {
        throw Error('Corrupted data');
    }


    result = {};
    result.data=data;
    result.dataLength=data.length;

    result.mhdr=parseMHDR(data[0]);
    result.macPayload=parseMacPayload(data.slice(1, data.length-4));
    result.mic=parseMIC(data); // kind of check digit
    decryptMessage(result);
    return result;
};






function parseMIC(data) {
    data=toArray(data);
    var mic={};
    mic.value=data.slice(data.length-4);
    return mic;
}

function decryptMessage(result) {
    // check if there is a frmPayload
    var frmPayload=result.macPayload.frmPayload;
    if (! frmPayload) return;

    // TODO

/*
    result.macPayload.decrypted={
        data:decrypted,
        text:AES.util.convertBytesToString(decrypted),
        hex:AES.util.convertBytesToString(decrypted,'hex')
    };
    */
}




function parseMHDR(value) {
    var mhdr={};
    mhdr.value=value;
    mhdr.mType=value >> 5 & 7;
    mhdr.mTypeText=mTypeTexts[mhdr.mType];
    mhdr.rfu=value >> 2 & 7;
    mhdr.major = value >> 0 & 3;
    if (mhdr.major===0) mhdr.majorText='LoRaWAN R1';
    else mhdr.majorText='RFU';
    return mhdr;
}


function parseMacPayload(value) {
    var currentShift=0;
    // FHDR (7..23) - Why not 22 ??? There can be only 15 opts
    // FPort (0..1)
    // FRMPayload (0..N)
    var macPayload={};
    macPayload.valueLength=value.length;
    macPayload.fhdr=parseFHDR(value);
    if (currentShift<value.length) { // there must be a FPort)
        macPayload.fPort=parseFPort(value[currentShift]);
        currentShift++;
        if (currentShift<value.length) { // there is a FRMPayload)
            macPayload.frmPayload=value.slice(currentShift);
        }
    }
    return macPayload;

    function parseFHDR(value) {
        var fhdr={};
        fhdr.devAddr=value.slice(0,4);
        fhdr.devAddrNumeric=(value[3]<<24)+(value[2]<<16)+(value[1]<<8)+value[0];
        var text='00000000'+fhdr.devAddrNumeric.toString(16);
        fhdr.devAddrText='0x'+text.slice(text.length-8);
        fhdr.fCtrl=parseFCtrl(value[4]);
        fhdr.fCnt=value.slice(5,7);
        fhdr.fOpts=value.slice(7, 7+fhdr.fCtrl.optsLen);
        fhdr.value=value.slice(0, 7+fhdr.fCtrl.optsLen);
        currentShift+=7+fhdr.fCtrl.optsLen;
        return fhdr;

        function parseFCtrl(value) {
            var fCtrl={};
            fCtrl.adr=value = value >> 7 & 1;
            fCtrl.adrackReq = value >> 6 & 1;
            fCtrl.ack = value >> 5 & 1;
            // todo : deal with uplink and downlonlink
            fCtrl.rfu = value >> 4 & 1;
            fCtrl.optsLen = value & 15;fCtrl.optsLen = value & 15;
            return fCtrl;
        }
    }



    function parseFPort(value) {
        var fPort={};
        fPort.value=value;
        if (value===0) {
            fPort.text='Only MAC commandes, decrypted using NwkSKey';
        } else if (value>0 && value<224) {
            fPort.text='Application-specific, decrypted using AppSKey';
        } else if (value>223) {
            fPort.text='Reserved for future standardized 13 application extension';
        }
        return fPort;
    }

    function parseFRMPayload(value) {

    }
}
