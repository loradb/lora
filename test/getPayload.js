'use strict';

let LORA = require('..');

describe('getPayload using default keys', function () {
    it('should return correct string', function () {
        let data='QAESAwKBbgACAbB2c5M9hkMWDus2m9lrqJ63NyclM+XZrkifwye9SPgA';
        var result=LORA.getPayload(data);
        result.ascii.should.equal('AABBCCDDEEFFGGHHIIJJKKLLMMNN');
        result.array.length.should.equal(28);
        result.hex.should.equal('4141424243434444454546464747484849494a4a4b4b4c4c4d4d4e4e');

        data='4001120302816E000201B07673933D8643160EEB369BD96BA89EB737272533E5D9AE489FC327BD48F800';
        LORA.getPayload(data).ascii.should.equal('AABBCCDDEEFFGGHHIIJJKKLLMMNN');
        data=[0x40,0x01,0x12,0x03,0x02,0x81,0x6E,0x00,0x02,0x01,0xB0,0x76,0x73,0x93,0x3D,0x86,0x43,0x16,0x0E,0xEB,0x36,0x9B,0xD9,0x6B,0xA8,0x9E,0xB7,0x37,0x27,0x25,0x33,0xE5,0xD9,0xAE,0x48,0x9F,0xC3,0x27,0xBD,0x48,0xF8,0x00];
        LORA.getPayload(data).ascii.should.equal('AABBCCDDEEFFGGHHIIJJKKLLMMNN');
    });
});