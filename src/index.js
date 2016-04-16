var parse = require('./util/parser.js');
var checkMIC = require('./util/checkMIC.js');
var getPayload = require('./util/getPayload.js');


/*
detailLevel:
* 0: data are split in corresponding fields
* 1: fields are parsed
* 2: fields are parsed and some information added
 */



function decrypt(data, options) {
    var result=parse(data, options);
    return result;
}

module.exports={
    decrypt: decrypt,
    parse: parse,
    checkMIC: checkMIC,
    getPayload: getPayload
}