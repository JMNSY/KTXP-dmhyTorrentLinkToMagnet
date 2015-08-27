// ==UserScript==
// @name       KTXP&dmhyTorrentLinkToMagnet
// @namespace  http://KTXP&dmhyTorrentLinkToMagnet/
// @version    2.6
// @description  将dmhy的超长磁链换成btih为40个字符长度的磁链，对另外两个站的列表页新增磁力链接 PS:沿用这个脚本并不是因为我认为bt.acg.gg或www.miobt.com跟极影有任何关系，只是受众有重叠
// @match      http://bt.acg.gg/*
// @match      http://www.miobt.com/*
// @match      https://share.dmhy.org/*
// @match      http://share.dmhy.org/*
// @require    http://code.jquery.com/jquery-1.9.0.min.js
// @license    GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright  2014.01.17, JMNSY
// ==/UserScript==

jQuery().ready(function(){
    jQuery.noConflict();
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
    if(jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']").length > 0){
        link = jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']");
        var thisurl = window.location.href
        if(/http[s]?:\/\/bt.acg.gg\/.*/.test(thisurl)){
            switchy = 2;
        }
        else if(/http[s]?:\/\/www.miobt.com\/.*/.test(thisurl)){
            switchy = 3;
        }
    }
    link.each(function(){
        if(switchy == 1){
            temp = jQuery(this).clone();
            str = jQuery(this).attr("href");
            jQuery(this).attr("href",str.substring(0,60));
        }
        else if (switchy == 0){
            temp = jQuery(this).clone();
            str = jQuery(this).attr("href");
            var b32 = str.split("&")[0].substring(20,52);
            var b16 = convertToBase16(b32);
            magnet = "magnet:?xt=urn:btih:" + b16;//b32;//
            jQuery(this).attr("href",magnet);
        }
        else if (switchy == 2){
            str = jQuery(this).attr("href").substring(5,45);
            magnet = "magnet:?xt=urn:btih:" + str;
            var a = jQuery("<a/>",{href:magnet,class:"magnet"});
            var icon = jQuery("<img/>",{src:"http://bt.acg.gg/images/icon_magnet.gif"});
            var addEle = a.append(icon);
            jQuery(this).before(addEle);
        }
        else if(switchy == 3){
            str = jQuery(this).attr("href").substring(5,45);
            magnet = "magnet:?xt=urn:btih:" + str;
            var a = jQuery("<a/>",{href:magnet,class:"magnet"});
            jQuery(this).before(a);
        }
    });
    if(switchy == 3){
        //我自己画的，有意见你就帮我画一个
        jQuery("a.magnet").css({"background-image":"url(data:image/gif;base64,R0lGODlhHQAlAPcAAP//////zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM//MAP+Z//+ZzP+Zmf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8AZv8AM/8AAMz//8z/zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZM8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wzAMwA/8wAzMwAmcwAZswAM8wAAJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm/5lmzJlmmZlmZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZzGaZmWaZZmaZM2aZAGZm/2ZmzGZmmWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/ZjP/MzP/ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNmMzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMAZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz/wAzzAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAMwAAAO0cJO0dJf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAANoALAAAAAAdACUAAAivAAEIHChQm8GDCA8SXMgQQMKHBhtKdAgx4cSGFS1eXJgR4UaOHSM2xEayJLZsIQ1mM8mSJcqUK1vKfBkypkyXKbXZvFmSZsedPE/mBMrTZ0aiN41WRDpzaFCTSiEybRn14VScMJ/2dKpVaNauVRNehcpVa1iEY7d+NVv26dmDaUlmezu3q9ywdWVqSxo1b0uDReeiFDz1oFu/NxPa5flwceLGjk12jJxzcU7DQTMGBAA7)","background-size":"contain","background-repeat":"no-repeat","padding-left":"15px"});
    }
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
