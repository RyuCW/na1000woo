if (navigator.userAgent.indexOf("BB10") > -1) {
    //only run this code if on BlackBerry 10

    cordova.define('cordova/plugin/qnx/nfc', function (require, exports, module) {
        var alphabet = "ABCDEFGHIJKLM" +
                       "NOPQRSTUVWXYZ" +
                       "abcdefghijklm" +
                       "nopqrstuvwxyz" +
                       "0123456789+/=";

        function b64toArray(input) {
            var result = [],
                workValue = [],
                bytes = [],
                offset = 0;

            while (offset < input.length) {
                for (var i = 0; i < 4; ++i) {
                    if (offset >= input.length) {
                        workValue[i] = 64;
                    } else {
                        var index = alphabet.indexOf(input.substring(offset++, offset));
                        if (index === -1) {
                            --i;
                            continue;
                        }
                        workValue[i] = index;
                    }
                }
                bytes[0] = (workValue[0] << 2 | workValue[1] >> 4) & 255;
                bytes[1] = (workValue[1] << 4 | workValue[2] >> 2) & 255; 
                bytes[2] = (workValue[2] << 6 | workValue[3]) & 255;
                
                if (workValue[3] === 64 && workValue[2] === 64) {
                    result.push(bytes[0]);
                } else if (workValue[3] === 64) {
                    result.push(bytes[0]);
                    result.push(bytes[1]);
                } else {
                    result.push(bytes[0]);
                    result.push(bytes[1]);
                    result.push(bytes[2]);
                }
            }
            
            return result;
        }

        function decodeNdefRecord(encoded) {

            var ndefRecord = { 
                    tnf: encoded[0] & 7
                },
                flags = encoded[0],
                isShortRecord = (flags & 16) !== 0, //  short record
                hasIdLength = (flags & 8) !== 0, // identification length
                offset = 1,
                typeLength = encoded[offset++],
                idLength = 0,
                payloadLength = 0;

            if (isShortRecord) {
                payloadLength = encoded[offset++];
            } else {
                for ( var i = 0; i < 4; ++i) {
                    payloadLength *= 256;
                    payloadLength |= encoded[offset++];
                }
            }
            
            if (hasIdLength) {
                idLength = encoded[offset++];
            }

            ndefRecord.type = encoded.slice(offset, offset + typeLength);

            offset += typeLength;
            ndefRecord.id = encoded.slice(offset, offset + idLength);            

            offset += idLength;
            ndefRecord.payload = encoded.slice(offset, offset + payloadLength);

            return ndefRecord;
        }

        function decode(encoding) {
            var decoded = [];
            var offset = 0;

            while (offset < encoding.length) {
                var start = offset;
                var remaining = encoding.length - offset;
                var flags = encoding[offset++];
                var minLength = 1 + 1;
                var sr = (flags & 16) !== 0;
                var il = (flags & 8) !== 0;

                minLength += sr ? 1 : 4;
                minLength += il ? 1 : 0;
                if (minLength <= remaining) {
                    var typeLength = encoding[offset++];
                    var payloadLength = 0;
                    if (sr) {
                        payloadLength = encoding[offset++];
                    } else {
                        for ( var i = 0; i < 4; ++i) {
                            payloadLength <<= 8;
                            payloadLength |= encoding[offset++];
                        }
                    }
                    var idLength = il ? encoding[offset++] : 0;
                    var totalLength = minLength + typeLength + payloadLength + idLength;
                    if (totalLength <= remaining) {
                        var encoded = encoding.slice(start, start + totalLength);

                        decoded.push(decodeNdefRecord(encoded));

                        offset = start + totalLength;
                    }
                }
            }
            return decoded;
        }

        module.exports = {
            init: function (args, win, fail) {
                blackberry.event.addEventListener("invoked", function (payload) {
                    cordova.fireDocumentEvent("ndef", {
                        type: 'ndef',
                        tag: {
                            ndefMessage: decode(b64toArray(payload.data))
                        }
                    });
                });
                win();
                return { "status" : cordova.callbackStatus.OK, "message" : "" };
            },
            registerTag: function (args, win, fail) {
                return { "status" : cordova.callbackStatus.ERROR, 
                    "message" : "addTagDiscoveredListener is no longer supported. Use addNdefListener." };
            },
            registerNdef: function (args, win, fail) {
                // do nothing 
                // init() handles the blackberry event and creates a phonegap-nfc event
                // and nfc.addNdefListener adds the listener for the client code
                return { "status" : cordova.callbackStatus.OK, "message" : "" };
            },
            shareTag: function(args, win, fail) {
                var message = args[0],
                    byteArray = ndef.encodeMessage(message),
                    data = "";
                
                for (var i=0; i< byteArray.length; ++i) {
                    data += String.fromCharCode(byteArray[i]);
                }

                var query = {
                        "action": "bb.action.SHARE",
                        "type": "application/vnd.rim.nfc.ndef",
                        "data": data
                };

                // http://developer.blackberry.com/html5/api/blackberry.invoke.html#.invoke
                blackberry.invoke.invoke(query, win, fail);
                
                return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "" };
            },
            unshareTag: function(args, win, fail) {
                blackberry.invoke.closeChildCard();
                // no idea if it worked, assume success
                return { "status" : cordova.callbackStatus.OK, "message" : "" };                
            }
        };
    });

    cordova.addConstructor(function () {
        var manager = cordova.require('cordova/plugin/qnx/manager');
        if (manager.addPlugin) {
            manager.addPlugin("NfcPlugin", 'cordova/plugin/qnx/nfc');
        }
        else {
            console.log("BB10 Support will only work with version 2.3 and higher");
        }
    });
}
/*global cordova, console */
/*jslint sloppy: false, browser: true */
"use strict";

function handleNfcFromIntentFilter() {

    // This was historically done in cordova.addConstructor but broke with PhoneGap-2.2.0.
    // We need to handle NFC from an Intent that launched the application, but *after*
    // the code in the application's deviceready has run.  After upgrading to 2.2.0,
    // addConstructor was finishing *before* deviceReady was complete and the
    // ndef listeners had not been registered.
    // It seems like there should be a better solution.
    setTimeout(
        function () {
            cordova.exec(
                function () {
                    console.log("Initialized the NfcPlugin");
                },
                function (reason) {
                    console.log("Failed to initialize the NfcPlugin " + reason);
                },
                "NfcPlugin", "init", []
            );
        }, 10
    );
}

document.addEventListener('deviceready', handleNfcFromIntentFilter, false);

var ndef = {
        
    // see android.nfc.NdefRecord for documentation about constants
    // http://developer.android.com/reference/android/nfc/NdefRecord.html
    TNF_EMPTY: 0x0,
    TNF_WELL_KNOWN: 0x01,
    TNF_MIME_MEDIA: 0x02,
    TNF_ABSOLUTE_URI: 0x03,
    TNF_EXTERNAL_TYPE: 0x04,
    TNF_UNKNOWN: 0x05,
    TNF_UNCHANGED: 0x06,
    TNF_RESERVED: 0x07,

    RTD_TEXT: [0x54], // "T"
    RTD_URI: [0x55], // "U" 
    RTD_SMART_POSTER: [0x53, 0x70], // "Sp"
    RTD_ALTERNATIVE_CARRIER: [0x61, 0x63], // "ac"
    RTD_HANDOVER_CARRIER: [0x48, 0x63], // "Hc"
    RTD_HANDOVER_REQUEST: [0x48, 0x72], // "Hr"
    RTD_HANDOVER_SELECT: [0x48, 0x73], // "Hs"

    /**
     * Creates a JSON representation of a NDEF Record.
     * 
     * @tnf 3-bit TNF (Type Name Format) - use one of the TNF_* constants
     * @type byte array, containing zero to 255 bytes, must not be null
     * @id byte array, containing zero to 255 bytes, must not be null
     * @payload byte array, containing zero to (2 ** 32 - 1) bytes, must not be null
     *
     * @returns JSON representation of a NDEF record
     * 
     * @see Ndef.textRecord, Ndef.uriRecord and Ndef.mimeMediaRecord for examples        
     */
    record: function (tnf, type, id, payload) {
        
        // handle null values
        if (!tnf) { tnf = ndef.TNF_EMPTY; }
        if (!type) { type = []; }
        if (!id) { id = []; }    
        if (!payload) { payload = []; }

        // convert strings to arrays
        if (!(type instanceof Array)) {
           type = nfc.stringToBytes(type);
        }
        if (!(id instanceof Array)) {
           id = nfc.stringToBytes(id);
        }
        if (!(payload instanceof Array)) {
           payload = nfc.stringToBytes(payload);
        }
                
        return {
            tnf: tnf,
            type: type,
            id: id,
            payload: payload
        };
    },

    /**
     * Helper that creates an NDEF record containing plain text.
     *
     * @text String of text to encode
     * @languageCode ISO/IANA language code. Examples: “fi”, “en-US”, “fr- CA”, “jp”. (optional)
     * @id byte[] (optional)
     */
    textRecord: function (text, languageCode, id) {
        var payload = [];
            
        if (!languageCode) { languageCode = 'en'; }   
        if (!id) { id = []; }   
        
        // TODO need to handle UTF-16 see Text Record Type Definition Section 3.2.1 Syntax, Table 3
        payload.push(languageCode.length);        
        nfc.concatArray(payload, nfc.stringToBytes(languageCode));
        nfc.concatArray(payload, nfc.stringToBytes(text));

        return ndef.record(ndef.TNF_WELL_KNOWN, ndef.RTD_TEXT, id, payload);
    },

    /**
     * Helper that creates a NDEF record containing a URI.
     *
     * @uri String
     * @id byte[] (optional)
     */
    uriRecord: function (uri, id) {
        if (!id) { id = []; }
        var payload = nfc.stringToBytes(uri);
        // add identifier code 0x0, meaning no prefix substitution
        payload.unshift(0x0);        
        return ndef.record(ndef.TNF_WELL_KNOWN, ndef.RTD_URI, id, payload);
    },

    /**
     * Helper that creates a NDEF record containing an absolute URI.
     *
     * @text String
     * @id byte[] (optional)
     */
    absoluteUriRecord: function (text, id) {
        if (!id) { id = []; }
        return ndef.record(ndef.TNF_ABSOLUTE_URI, nfc.stringToBytes(text), id, []);
    },

    /**
     * Helper that creates a NDEF record containing an mimeMediaRecord.
     *
     * @mimeType String
     * @payload byte[]
     * @id byte[] (optional)
     */    
    mimeMediaRecord: function (mimeType, payload, id) {
        if (!id) { id = []; }   
        return ndef.record(ndef.TNF_MIME_MEDIA, nfc.stringToBytes(mimeType), id, payload);
    },

    /**
     * Helper that creates an NDEF record containing an Smart Poster.
     *
     * @ndefRecords array of NDEF Records
     * @id byte[] (optional)
     */    
    smartPoster: function (ndefRecords, id) {
        var payload = [];
        
        if (!id) { id = []; }
        
        if (ndefRecords)
        {
            // make sure we have an array of something like NDEF records before encoding
            if (ndefRecords[0] instanceof Object && ndefRecords[0].hasOwnProperty('tnf')) {
                payload = ndef.encodeMessage(ndefRecords);                
            } else {
                // assume the caller has already encoded the NDEF records into a byte array
                payload = ndefRecords;
            }
        } else {
            console.log("WARNING: Expecting an array of NDEF records");
        }
                   
        return ndef.record(ndef.TNF_WELL_KNOWN, ndef.RTD_SMART_POSTER, id, payload);
    },

    /**
     * Helper that creates an empty NDEF record.
     *
     */
    emptyRecord: function() {
        return ndef.record(ndef.TNF_EMPTY, [], [], []);        
    },
    
    /**
     * Encodes an NDEF Message into bytes that can be written to a NFC tag.
     * 
     * @ndefRecords an Array of NDEF Records
     *
     * @returns byte array
     * 
     * @see NFC Data Exchange Format (NDEF) http://www.nfc-forum.org/specs/spec_list/
     */
    encodeMessage: function (ndefRecords) {

        var encoded = [],
            tnf_byte,
            type_length,
            payload_length,
            id_length,
            i,
            mb, me, // messageBegin, messageEnd
            cf = false, // chunkFlag TODO implement
            sr, // boolean shortRecord
            il; // boolean idLengthFieldIsPresent

        for(i = 0; i < ndefRecords.length; i++) {

            mb = (i === 0);
            me = (i === (ndefRecords.length - 1));
            sr = (ndefRecords[i].payload.length < 0xFF);
            il = (ndefRecords[i].id.length > 0);
            tnf_byte = ndef.encodeTnf(mb, me, cf, sr, il, ndefRecords[i].tnf);
            encoded.push(tnf_byte);

            type_length = ndefRecords[i].type.length;
            encoded.push(type_length);

            if (sr) {
                payload_length = ndefRecords[i].payload.length;
                encoded.push(payload_length);
            } else {
                payload_length = ndefRecords[i].payload.length;
                // 4 bytes
                encoded.push((payload_length >> 24));
                encoded.push((payload_length >> 16));
                encoded.push((payload_length >> 8));
                encoded.push((payload_length & 0xFF));
            }

            if (il) {
                id_length = ndefRecords[i].id.length;
                encoded.push(id_length);
            }

            encoded = encoded.concat(ndefRecords[i].type);

            if (il) {
                encoded = encoded.concat(ndefRecords[i].id);
            }

            encoded = encoded.concat(ndefRecords[i].payload);
        }

        return encoded;
    },

    /**
     * Decodes an array bytes into an NDEF Message
     * 
     * @bytes an array bytes read from a NFC tag
     *
     * @returns array of NDEF Records
     * 
     * @see NFC Data Exchange Format (NDEF) http://www.nfc-forum.org/specs/spec_list/
     */
    decodeMessage: function (bytes) {

        var ndef_message = [],
            tnf_byte = bytes.shift(),
            header = ndef.decodeTnf(tnf_byte),
            type_length = 0,
            payload_length = 0,
            id_length = 0,
            record_type = [],
            id = [],
            payload = [];
            
        while(bytes.length) {

            type_length = bytes.shift();

            if (header.sr) {
                payload_length = bytes.shift();
            } else {
                // next 4 bytes are length
                payload_length = ((0xFF & bytes.shift()) << 24) |
                    ((0xFF & bytes.shift()) << 26) |
                    ((0xFF & bytes.shift()) << 8) | 
                    (0xFF & bytes.shift());
            }

            if (header.il) {
                id_length = bytes.shift();
            }

            record_type = bytes.splice(0, type_length);
            id = bytes.splice(0, id_length);
            payload = bytes.splice(0, payload_length);

            ndef_message.push(
                ndef.record(header.tnf, record_type, id, payload)
            );

            if (header.me) break; // last message
        }

        return ndef_message;
    },
    
    /**
     * Decode the bit flags from a TNF Byte.
     * 
     * @returns object with decoded data
     *
     *  See NFC Data Exchange Format (NDEF) Specification Section 3.2 RecordLayout
     */
    decodeTnf: function (tnf_byte) {
        return {
            mb: (tnf_byte & 0x80) !== 0,
            me: (tnf_byte & 0x40) !== 0,
            cf: (tnf_byte & 0x20) !== 0,
            sr: (tnf_byte & 0x10) !== 0,
            il: (tnf_byte & 0x8) !== 0,
            tnf: (tnf_byte & 0x7)
        };
    },

    /**
     * Encode NDEF bit flags into a TNF Byte.
     * 
     * @returns tnf byte
     *
     *  See NFC Data Exchange Format (NDEF) Specification Section 3.2 RecordLayout
     */
    encodeTnf: function (mb, me, cf, sr, il, tnf) {

        var value = tnf;

        if (mb) {
            value = value | 0x80;
        }

        if (me) {
            value = value | 0x40;
        }
        
        // note if cf: me, mb, li must be false and tnf must be 0x6
        if (cf) {
            value = value | 0x20;
        }

        if (sr) {
            value = value | 0x10;
        }

        if (il) {
            value = value | 0x8;
        }

        return value;
    }
    
};

var nfc = {

    addTagDiscoveredListener: function (callback, win, fail) {
        document.addEventListener("tag", callback, false);
        cordova.exec(win, fail, "NfcPlugin", "registerTag", []);
    },

    addMimeTypeListener: function (mimeType, callback, win, fail) {
        document.addEventListener("ndef-mime", callback, false);    
        cordova.exec(win, fail, "NfcPlugin", "registerMimeType", [mimeType]);
    },
    
    addNdefListener: function (callback, win, fail) {
        document.addEventListener("ndef", callback, false);                
        cordova.exec(win, fail, "NfcPlugin", "registerNdef", []);
    },

    addNdefFormatableListener: function (callback, win, fail) {
        document.addEventListener("ndef-formatable", callback, false);
        cordova.exec(win, fail, "NfcPlugin", "registerNdefFormatable", []);
    },
    
    write: function (ndefMessage, win, fail) {
        cordova.exec(win, fail, "NfcPlugin", "writeTag", [ndefMessage]);
    },

    share: function (ndefMessage, win, fail) {
        cordova.exec(win, fail, "NfcPlugin", "shareTag", [ndefMessage]);
    },

    unshare: function (win, fail) {
        cordova.exec(win, fail, "NfcPlugin", "unshareTag", []);
    },

    erase: function (win, fail) {
        cordova.exec(win, fail, "NfcPlugin", "eraseTag", [[]]);
    },

    removeTagDiscoveredListener: function (callback, win, fail) {
        document.removeEventListener("tag", callback, false);
        cordova.exec(win, fail, "NfcPlugin", "removeTag", []);
    },

    removeMimeTypeListener: function(mimeType, callback, win, fail) {
        document.removeEventListener("ndef-mime", callback, false);
        cordova.exec(win, fail, "NfcPlugin", "removeMimeType", [mimeType]);
    },

    removeNdefListener: function (callback, win, fail) {
        document.removeEventListener("ndef", callback, false);
        cordova.exec(win, fail, "NfcPlugin", "removeNdef", []);
    },

    concatArray: function (a1, a2) { // this isn't built in?
        for (var i = 0; i < a2.length; i++) {
            a1.push(a2[i]);
        }
        return a1;
    },

    bytesToString: function (bytes) {
        var bytesAsString = "";
        for (var i = 0; i < bytes.length; i++) {
            bytesAsString += String.fromCharCode(bytes[i]);
        }
        return bytesAsString;
    },

    // http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string#1242596
    stringToBytes: function (str) {
        var ch, st, re = [];
        for (var i = 0; i < str.length; i++ ) {
            ch = str.charCodeAt(i);  // get char
            st = [];                 // set up "stack"
            do {
                st.push( ch & 0xFF );  // push byte to stack
                ch = ch >> 8;          // shift value down by 1 byte
            } while ( ch );
            // add stack contents to result
            // done because chars have "wrong" endianness
            re = re.concat( st.reverse() );
        }
        // return an array of bytes
        return re;
    },

    bytesToHexString: function (bytes) {
        var dec, hexstring, bytesAsHexString = "";
        for (var i = 0; i < bytes.length; i++) {
            if (bytes[i] >= 0) {
                dec = bytes[i];
            } else {
                dec = 256 + bytes[i];
            }
            hexstring = dec.toString(16);
            // zero padding
            if (hexstring.length == 1) {
                hexstring = "0" + hexstring;
            }
            bytesAsHexString += hexstring;
        }
        return bytesAsHexString;
    }
    
};

var util = {
    // i must be <= 256
    toHex: function (i) {
        var hex;

        if (i < 0) {
            i += 256;
        }

        hex = i.toString(16);

        // zero padding
        if (hex.length == 1) {
            hex = "0" + hex;
        } 
        
        return hex;
    },

    toPrintable: function(i) {

        if (i >= 0x20 & i <= 0x7F) {
            return String.fromCharCode(i);
        } else {
            return '.';
        }
    }
};

// added since WP8 must call a named function
// TODO consider switching NFC events from JS events to using the PG callbacks
function fireNfcTagEvent(eventType, tagAsJson) {
    setTimeout(function () {
        var e = document.createEvent('Events');
        e.initEvent(eventType, true, false);
        e.tag = JSON.parse(tagAsJson);
        console.log(e.tag);
        document.dispatchEvent(e);
    }, 10);
}
