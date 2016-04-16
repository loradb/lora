'use strict';

let LORA = require('..');

describe('checkMIC using default keys', function () {
    it('some tests should be true', function () {
        let data='QAESAwKBbgACAbB2c5M9hkMWDus2m9lrqJ63NyclM+XZrkifwye9SPgA';
        LORA.checkMIC(data).should.equal(true);
        data='4001120302816E000201B07673933D8643160EEB369BD96BA89EB737272533E5D9AE489FC327BD48F800';
        LORA.checkMIC(data).should.equal(true);
        data=[0x40,0x01,0x12,0x03,0x02,0x81,0x6E,0x00,0x02,0x01,0xB0,0x76,0x73,0x93,0x3D,0x86,0x43,0x16,0x0E,0xEB,0x36,0x9B,0xD9,0x6B,0xA8,0x9E,0xB7,0x37,0x27,0x25,0x33,0xE5,0xD9,0xAE,0x48,0x9F,0xC3,0x27,0xBD,0x48,0xF8,0x00];
        LORA.checkMIC(data).should.equal(true);
    });
    it('some tests should be false', function () {
        let data='QAESAwKBbgACAbB2c5M9hkMWDus2m9lrqJ63NyclM+XZrkifwye9SPgB';
        LORA.checkMIC(data).should.equal(false);
        data='RAESAwKBbgACAbB2c5M9hkMWDus2m9lrqJ63NyclM+XZrkifwye9SPgA';
        LORA.checkMIC(data).should.equal(false);
    });
});