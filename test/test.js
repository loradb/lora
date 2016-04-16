'use strict';

var LORA = require('..');

describe('decrypt using default keys', function () {

    var data='QAESAwKBbgACAbB2c5M9hkMWDus2m9lrqJ63NyclM+XZrkifwye9SPgA';

    console.log(LORA);

    it('should return AABBCCDDEEFFGGHHIIJJKKLLMMNN', function () {
        var result=LORA.parse(data);
        console.log(result);

    });
});