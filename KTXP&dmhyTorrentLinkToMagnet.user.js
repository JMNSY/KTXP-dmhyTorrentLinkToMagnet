// ==UserScript==
// @name       KTXP&dmhyTorrentLinkToMagnet
// @namespace  http://KTXP&dmhyTorrentLinkToMagnet/
// @version    2.5
// @description  将两个站的超长磁链换成btih为40个字符长度的磁链 PS:沿用这个脚本并不是因为我认为bt.acg.ms跟极影有任何关系，只是两者的受众有重叠
// @match      http://bt.acg.ms/*
// @match      https://share.dmhy.org/*
// @match      http://share.dmhy.org/*
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright  2014.01.17, JMNSY
// ==/UserScript==

jQuery().ready(function(){
    var link;
    var switchy;
    if(jQuery(".quick-down").length > 0){
        link = jQuery(".quick-down");
        switchy = 1;
    }
    if(jQuery(".download-arrow[title='磁力下載']").length > 0){
        link = jQuery(".download-arrow[title='磁力下載']");
        switchy = 0;
    }
    link.each(function(){
        temp = jQuery(this).clone();
        str = jQuery(this).attr("href");
        //var words = str.split("/");
        //torrent = words[words.length - 1];
        //hash = torrent.split(".")[0];
        if(switchy == 1)
            jQuery(this).attr("href",str.substring(0,60));
        else{
            var b32 = str.split("&")[0].substring(20,52);
            var b16 = convertToBase16(b32);
            magnet = "magnet:?xt=urn:btih:" + b16;//b32;//
            jQuery(this).attr("href",magnet);
        }
    });
});
function convertToBase16(base32){
    var hex = "0123456789ABCDEF";
    var strHex = "";
    var decodedB32 = Base32Decode(base32);
    for(var i=0; i<decodedB32.length; i++){ 
        strHex += hex.charAt(decodedB32[i]/16) + hex.charAt(decodedB32[i]%16);
    }
    return strHex;
}

/**
* @author:Chris Miceli
*/
function Base32Decode(base32EncodedString) {
    /// <summary>Decodes a base32 encoded string into a Uin8Array, note padding is not supported</summary>
    /// <param name="base32EncodedString" type="String">The base32 encoded string to be decoded</param>
    /// <returns type="Uint8Array">The Unit8Array representation of the data that was encoded in base32EncodedString</returns>
    if (!base32EncodedString && base32EncodedString !== "") {
        throw "base32EncodedString cannot be null or undefined";
    }

    if (base32EncodedString.length * 5 % 8 !== 0) {
        throw "base32EncodedString is not of the proper length. Please verify padding.";
    }

    base32EncodedString = base32EncodedString.toLowerCase();
    var alphabet = "abcdefghijklmnopqrstuvwxyz234567";
    var returnArray = new Array(base32EncodedString.length * 5 / 8);

    var currentByte = 0;
    var bitsRemaining = 8;
    var mask = 0;
    var arrayIndex = 0;

    for (var count = 0; count < base32EncodedString.length; count++) {
        var currentIndexValue = alphabet.indexOf(base32EncodedString[count]);
        if (-1 === currentIndexValue) {
            if ("=" === base32EncodedString[count]) {
                var paddingCount = 0;
                for (count = count; count < base32EncodedString.length; count++) {
                    if ("=" !== base32EncodedString[count]) {
                        throw "Invalid '=' in encoded string";
                    } else {
                        paddingCount++;
                    }
                }

                switch (paddingCount) {
                    case 6:
                        returnArray = returnArray.slice(0, returnArray.length - 4);
                        break;
                    case 4:
                        returnArray = returnArray.slice(0, returnArray.length - 3);
                        break;
                    case 3:
                        returnArray = returnArray.slice(0, returnArray.length - 2);
                        break;
                    case 1:
                        returnArray = returnArray.slice(0, returnArray.length - 1);
                        break;
                    default:
                        throw "Incorrect padding";
                }
            } else {
                throw "base32EncodedString contains invalid characters or invalid padding.";
            }
        } else {
            if (bitsRemaining > 5) {
                mask = currentIndexValue << (bitsRemaining - 5);
                currentByte = currentByte | mask;
                bitsRemaining -= 5;
            } else {
                mask = currentIndexValue >> (5 - bitsRemaining);
                currentByte = currentByte | mask;
                returnArray[arrayIndex++] = currentByte;
                currentByte = currentIndexValue << (3 + bitsRemaining);
                bitsRemaining += 3;
            }
        }
    }

    return new Uint8Array(returnArray);
};

