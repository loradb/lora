var parse = require('./util/parser.js');
var checkMIC = require('./util/checkMIC.js');

const defaultAppSKey = [0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C]
const defaultNwkSKey = [0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C]

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
    checkMIC: checkMIC
}