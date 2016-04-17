
## Library to check and decrypt Lora PHYPayload


To install:
```
npm install lora
```

To test in node using the default appSKey and nwkSKey 2B7E151628AED2A6ABF7158809CF4F3C:
```
var lora = require('lora');
lora.getPayload('QAESAwKBbgACAbB2c5M9hkMWDus2m9lrqJ63NyclM+XZrkifwye9SPgA');
// should return an object with ascii: AABBCCDDEEFFGGHHIIJJKKLLMMNN
```

### getPayload(data, nwkSKey, appSKey)

Check if the PHYPayload is valid (correct MIC) and returns an object with
the decrypted payload as an object containing:
* array: array containins the decrypted bytes
* ascii: bytes converted to ascii
* hex: string containing the data as hexadecimal

Parameters:
* data: array, base64 or hex encoded PHYPayload
* nwkSKey: network session key (default: 2B7E151628AED2A6ABF7158809CF4F3C)
* appSKey: application session key (default: 2B7E151628AED2A6ABF7158809CF4F3C)

### checkMIC(data, nwkSKey)

Check if the PHYPayload MIC (message integrity code) is correct (returns true or false).

Parameters:
* data: array, base64 or hex encoded PHYPayload
* nwkSKey: network session key (default: 2B7E151628AED2A6ABF7158809CF4F3C)

### debug(data, nwkSKey, appSKey)

Returns an object with all the information about the PHYPayload and the
corresponding hierarchy

Parameters:
* data: array, base64 or hex encoded PHYPayload
* nwkSKey: network session key (default: 2B7E151628AED2A6ABF7158809CF4F3C)
* appSKey: application session key (default: 2B7E151628AED2A6ABF7158809CF4F3C)
