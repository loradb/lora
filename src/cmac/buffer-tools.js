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

exports.bitShiftLeft = function (buffer) {
    var shifted = new Buffer(buffer.length);
    var last = buffer.length - 1;
    for (var index = 0; index < last; index++) {
        shifted[index] = buffer[index] << 1;
        if (buffer[index + 1] & 0x80) {
            shifted[index] += 0x01;
        }
    }
    shifted[last] = buffer[last] << 1;
    return shifted;
}

exports.xor = function (bufferA, bufferB) {
    var length = Math.min(bufferA.length, bufferB.length);
    var output = new Buffer(length);
    for (var index = 0; index < length; index++) {
        output[index] = bufferA[index] ^ bufferB[index];
    }
    return output;
}

var bitmasks = [0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01];

exports.toBinaryString = function (buffer) {
    var binary = '';
    for (var bufferIndex = 0; bufferIndex < buffer.length; bufferIndex++) {
        for (var bitmaskIndex = 0; bitmaskIndex < bitmasks.length; bitmaskIndex++) {
            binary += (buffer[bufferIndex] & bitmasks[bitmaskIndex]) ? '1' : '0';
        }
    }
    return binary;
}