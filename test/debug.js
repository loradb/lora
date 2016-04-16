'use strict';

var LORA = require('..');

describe('decrypt using default keys', function () {

    var data='QAESAwKBbgACAbB2c5M9hkMWDus2m9lrqJ63NyclM+XZrkifwye9SPgA';

    it('should return AABBCCDDEEFFGGHHIIJJKKLLMMNN', function () {
        var result=LORA.debug(data);
        result.mhdr.value.should.equal(64);
        result.mhdr.major.should.equal(0);
        result.macPayload.fhdr.devAddrNumeric.should.equal(33755649);
        result.macPayload.fPort.value.should.equal(1);
        result.macPayload.frmPayload.decrypted.ascii.should.equal('AABBCCDDEEFFGGHHIIJJKKLLMMNN');
    });
});