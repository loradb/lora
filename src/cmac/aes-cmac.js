/*
 The MIT License (MIT)

 Copyright (c) 2014 Allan Stewart

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var crypto = require('crypto');
var bufferTools = require('./buffer-tools.js');

var const_Zero = new Buffer('00000000000000000000000000000000', 'hex');
var const_Rb = new Buffer('00000000000000000000000000000087', 'hex');
var const_blockSize = 16;

exports.generateSubkeys = function (key) {
    var l = aes(key, const_Zero);

    var subkey1 = bufferTools.bitShiftLeft(l);
    if (l[0] & 0x80) {
        subkey1 = bufferTools.xor(subkey1, const_Rb);
    }

    var subkey2 = bufferTools.bitShiftLeft(subkey1);
    if (subkey1[0] & 0x80) {
        subkey2 = bufferTools.xor(subkey2, const_Rb);
    }

    return { subkey1: subkey1, subkey2: subkey2 };
};

function aes(key, message) {
    var keyLengthToCipher = { 16: 'aes128', 24: 'aes192', 32: 'aes256' };
    if (!keyLengthToCipher[key.length]) {
        throw new Error('Keys must be 128, 192, or 256 bits in length.');
    }
    var cipher = crypto.createCipheriv(keyLengthToCipher[key.length], key, const_Zero);
    var result = cipher.update(message);
    cipher.final();
    return result;
}

exports.aesCmac = function (key, message) {
    var subkeys = exports.generateSubkeys(key);
    var blockCount = Math.ceil(message.length / const_blockSize);
    var lastBlockCompleteFlag, lastBlock, lastBlockIndex;

    if (blockCount === 0) {
        blockCount = 1;
        lastBlockCompleteFlag = false
    } else {
        lastBlockCompleteFlag = (message.length % const_blockSize === 0);
    }
    lastBlockIndex = blockCount -1;

    if (lastBlockCompleteFlag) {
        lastBlock = bufferTools.xor(getMessageBlock(message, lastBlockIndex), subkeys.subkey1);
    } else {
        lastBlock = bufferTools.xor(getPaddedMessageBlock(message, lastBlockIndex), subkeys.subkey2);
    }

    var x = new Buffer('00000000000000000000000000000000', 'hex');
    var y;

    for (var index = 0; index < lastBlockIndex; index++) {
        y = bufferTools.xor(x, getMessageBlock(message, index));
        x = aes(key, y);
    }
    y = bufferTools.xor(lastBlock, x);
    return aes(key, y);
};

function getMessageBlock(message, blockIndex) {
    var block = new Buffer(const_blockSize);
    var start = blockIndex * const_blockSize;
    var end = start + const_blockSize;

    message.copy(block, 0, start, end);

    return block;
}

function getPaddedMessageBlock(message, blockIndex) {
    var block = new Buffer(const_blockSize);
    var start = blockIndex * const_blockSize;
    var end = message.length;

    block.fill(0);
    message.copy(block, 0, start, end);
    block[end - start] = 0x80;

    return block;
}