// ==UserScript==
// @name       KTXP&dmhyTorrentLinkToMagnet
// @namespace  http://KTXP&dmhyTorrentLinkToMagnet/
// @version    2.9
// @description  将dmhy的超长磁链换成btih为40个字符长度的磁链，对另外两个站的列表页新增磁力链接 PS:沿用这个脚本并不是因为我认为bt.acg.gg或www.miobt.com跟极影有任何关系，只是受众有重叠
// @match      http://bt.acg.gg/*
// @match      http://www.miobt.com/*
// @match      http://miobt.com/*
// @match      https://share.dmhy.org/*
// @match      http://share.dmhy.org/*
// @match      http://share.popgo.org/*
// @match      https://share.popgo.org/*
// @require    http://code.jquery.com/jquery-1.9.0.min.js
// @grant      GM_setClipboard
// @license    GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright  2014.01.17, JMNSY
// ==/UserScript==

jQuery().ready(function(){
    jQuery.noConflict();
    var isShowTorrent = true;
    var link;
    var switchy;
    var copyimg = "data:image/gif;base64,R0lGODlhMwA2APcAAP//////zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM//MAP+Z//+ZzP+Zmf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8AZv8AM/8AAMz//8z/zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZM8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wzAMwA/8wAzMwAmcwAZswAM8wAAJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm/5lmzJlmmZlmZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZzGaZmWaZZmaZM2aZAGZm/2ZmzGZmmWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/ZjP/MzP/ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNmMzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMAZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz/wAzzAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAMwAAAKSkpJWVlYSEhH19fXx8fFlZWUpKSi8vLx8fHxUVFQgICKampp2dnZeXl5KSko2NjX9/f3l5eXJycmtra1paWlJSUk1NTUlJSUVFRUBAQDc3Ny4uLisrKyYmJh4eHhYWFhQUFBISEg4ODgsLCwkJCQYGBgICAv///yH5BAEAAP8ALAAAAAAzADYAAAj/AP8JHEhwYDd91xIqXMiwoUOF/NwVnEgw3MOLGB/uQ0ex4L2MIENe29dxYLqF76xgW8mypcuXLseRa+dPYbeS/+IpPIezZ89+Ce3hZJWQns+jHeElxIdTHTx4PJFKHYguYbipWJFqs5q1K86t1656HVsQrNh/geTN+8a2rdu3cON+mxdPXUmzAvOJ3NuwXke8CPkKVuh3otl2Cvt5S7eNm+PHkCNLhrxNnbyFUQma1XvNH0eyHdcpbGfYqriE8EDjBJfwXemwp69lVj0R8TVvr8PFLke7I7uEuMuaTpitN8VuwHPHLm68IPLbyok3d55cOGzp0w1W1zz8GvPs/54H7Od+3Tt4geKjmz+f3rpu7ODbk3+/Pv72gWaXnw9/X2B++NnJh1933wXY3z//1WcgdO7px96BCRY4nYD+EbgfhQha+CCD8zloH4cDlidhcxhGeOGBJ4l4IogCEXUNPh4uOJ5AKV5TT4wTtkYVPQupgyOJOra4kFA/Gveca0IWJVCRvR05kDrvtKPNQEzShiFBVap2JZUJ8XbebywWFNts09k240SxpXYea9cg2RFn/mwDnmgJkVaSbZ3Fw9g2fPbp55+A/qkOjwqZ01NggwlmVE/mfJToXosetQ499oBj6aWYZqrppuDYw0o6RwUEADs=";
    var thisurl = window.location.href
    //适配天国的极影列表页
    if(jQuery(".quick-down").length > 0){
        link = jQuery(".quick-down");
        switchy = 1;
    }
    //适配花园列表页
    else if(jQuery(".download-arrow[title='磁力下載']").length > 0){
        //修改表头
        jQuery("span.title").eq(3).parent().attr("width","6%");
        if(isShowTorrent){
            jQuery("span.title").eq(3).text("磁鏈 種子")
        }
        link = jQuery(".download-arrow[title='磁力下載']");
        switchy = 0;
        var copyIt = jQuery("<div/>",{id:"copySelectedMagnet"}).on("click",copyMagnet).css({
            "background-image":"url(" + copyimg + ")",
            "background-size":"contain",
            "background-repeat":"no-repeat",
            "padding":"15px 15px",
            "position":"fixed",
            "right":"5px",
            "bottom":"90px",
            "cursor":"pointer"
        });
        jQuery("body").append(copyIt);
    }
    //适配bt.acg.gg和miobt.com列表页
    else if(jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']").length > 0){
        link = jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']");
        if(/http[s]?:\/\/bt.acg.gg\/.*/.test(thisurl)){
            switchy = 2;
        }
        else if(/http[s]?:\/\/(www.)?miobt.com\/.*/.test(thisurl)){
            switchy = 3;
        }
    }
    //适配漫游列表页
    else if(jQuery("#index_maintable > tbody > tr").length > 1){
        link = jQuery("#index_maintable > tbody > tr >td>a[href^='magnet:?']");
        switchy = 4;
    }
    //对列表页表格中的每一行
    if(link != null){
        link.each(function(){
            if(switchy == 1){
                temp = jQuery(this).clone();//原本用于复制一个种子下载图标，链接改为磁链，现在用不上，说到底这个分支目前都不会走
                str = jQuery(this).attr("href");
                jQuery(this).attr("href",str.substring(0,60));
            }
            else if (switchy == 0){
                //复制一个磁链图标并改造为种子下载图标
                temp = jQuery(this).clone().removeClass("arrow-magnet").addClass("arrow-torrent").attr("title","種子下載");
                //获得当前资源磁链
                str = jQuery(this).attr("href");
                //获得当前资源发布日期时间
                var datetime = jQuery(this).parent().parent().children().eq(0).children().eq(0).text();
                //获得当前资源发布日期
                var date = datetime.substring(0,datetime.lastIndexOf(" "));
                //获得当前磁链的base32编码hash
                var b32 = str.split("&")[0].substring(20,52);
                //解码后编码为HEX
                var b16 = convertToBase16(b32);
                //构成磁链
                magnet = "magnet:?xt=urn:btih:" + b16;//b32;//
                //构成种子链
                var torrentLink = "//dl.dmhy.org/" + date + "/" + b16.toLowerCase() + ".torrent";
                //把种子下载链接的href置为种子链
                temp.attr("href",torrentLink);
                var check = jQuery("<input/>",{type:"checkbox",class:"checkMagnet",value:magnet});
                //把磁链的href置为16位磁链，在磁链图标后加入种子下载图标
                var magnetArrow = jQuery(this).attr("href",magnet);
                magnetArrow.before(check);
                if(isShowTorrent){
                    magnetArrow.after(temp);
                }
            }
            else if (switchy == 2){
                //从资源页url中切出hex编码hash
                str = jQuery(this).attr("href").substring(5,45);
                //构成磁链
                magnet = "magnet:?xt=urn:btih:" + str;
                //新增一个图标，以链接元素包围
                var a = jQuery("<a/>",{href:magnet,class:"magnet"});
                var icon = jQuery("<img/>",{src:"http://bt.acg.gg/images/icon_magnet.gif"});
                var addEle = a.append(icon);
                //把整个元素放在资源页链接前
                jQuery(this).before(addEle);
            }
            else if(switchy == 3){
                //从资源页url中切出hex编码hash
                str = jQuery(this).attr("href").substring(5,45);
                //构成磁链
                magnet = "magnet:?xt=urn:btih:" + str;
                //新增一个链接元素，插在资源页链接前
                var a = jQuery("<a/>",{href:magnet,class:"magnet"});
                jQuery(this).before(a);
            }
            else if(switchy == 4){
                //获取该行的tr元素
                var tr = jQuery(this).parent().parent();
                //获取该行的第一个单元格中的第一个元素，即标题图磁力下载，title为激情起步
                var titleimg = tr.children().eq(0).children(0).eq(0);
                //获取上述元素的href，即hash为base32编码的磁链
                var href = titleimg.attr("href");
                //由于该磁链在处理前都带有tr参数，因此反而比仅含base16编码hash的磁链要长
                //如果该行“激情起步”的href未被处理(当前元素jQuery(this)此时理论上就是“激情起步”)
                if(href.length > 60){
                    //切出base32编码的hash
                    var b32 = href.substring(20,52);
                    //对其解码，并重新编码成base16
                    var b16 = convertToBase16(b32);
                    //构成磁链
                    magnet = "magnet:?xt=urn:btih:" + b16;
                    //trace, o..不对，把标题图磁力下载的href置为hash为16位编码的磁链
                    titleimg.attr("href",magnet);
                    //也将当前元素的href置为hash为16位编码的磁链
                    jQuery(this).attr("href",magnet);
                }
                //如果该行“激情起步”的href已被处理(当前元素jQuery(this)此时理论上是行尾的“下载”)
                else if(href.length == 60){
                    //直接将其置为当行“激情起步”的href
                    jQuery(this).attr("href",href);
                }
            }
        });
    }
    if(switchy == 0 && temp != null){
        var checkall = jQuery("<input/>",{type:"checkbox",id:"checkAll"});
        jQuery("span.title").eq(3).before(checkall).parent();//href中的换行会被无视，另找出路
        jQuery("#checkAll").on("change",checkAll);
    }
    //花园资源页
    if(/http[s]?:\/\/share\.dmhy\.org\/topics\/view\/.*/.test(thisurl)){
        //获取种子链中的base16编码hash
        var str = jQuery("#tabs-1 >p >a[href$='torrent']").eq(0).attr("href");
        //构成磁链
        magnet = "magnet:?xt=urn:btih:" + str.substring(str.lastIndexOf("/")+1,str.lastIndexOf("."));
        //获取到磁链对应的链接元素
        var a =  jQuery("#tabs-1 >p >a[href^='magnet']").eq(0);
        //将其文本和href均置为hash为base16编码的磁链
        a.attr("href",magnet).text(magnet);
    }
    //漫游资源页
    else if(/http[s]?:\/\/share\.popgo\.org\/program-.*/.test(thisurl)){
        //获取种子链中的base16编码hash
        var str = jQuery("#si_downseed > a[href*='share.popgo.org/downseed.php?hash']").attr("href");
        //构成磁链
        magnet = "magnet:?xt=urn:btih:" + str.substring(str.lastIndexOf("=")+1);
        //获取到磁链对应的链接元素
        var a =  jQuery("#si_downseed >span>a").eq(0);
        //将其href置为hash为base16编码的磁链
        a.attr("href",magnet);
    }
    else if(switchy == 3){
        //我自己画的，有意见你就帮我画一个
        //对miobt.com中，由该脚本新增的链接添加样式，使链接有足够面积被点击，并以有明显意义的图标作为背景
        jQuery("a.magnet").css({"background-image":"url(data:image/gif;base64,R0lGODlhHQAlAPcAAP//////zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM//MAP+Z//+ZzP+Zmf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8AZv8AM/8AAMz//8z/zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZM8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wzAMwA/8wAzMwAmcwAZswAM8wAAJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm/5lmzJlmmZlmZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZzGaZmWaZZmaZM2aZAGZm/2ZmzGZmmWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/ZjP/MzP/ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNmMzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMAZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz/wAzzAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAMwAAAO0cJO0dJf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAANoALAAAAAAdACUAAAivAAEIHChQm8GDCA8SXMgQQMKHBhtKdAgx4cSGFS1eXJgR4UaOHSM2xEayJLZsIQ1mM8mSJcqUK1vKfBkypkyXKbXZvFmSZsedPE/mBMrTZ0aiN41WRDpzaFCTSiEybRn14VScMJ/2dKpVaNauVRNehcpVa1iEY7d+NVv26dmDaUlmezu3q9ywdWVqSxo1b0uDReeiFDz1oFu/NxPa5flwceLGjk12jJxzcU7DQTMGBAA7)","background-size":"contain","background-repeat":"no-repeat","padding-left":"15px"});
    }
});
function copyMagnet(){
    var i = 0;
    var arr = new Array();
    jQuery(".checkMagnet:checked").each(function(){
        arr[i] = jQuery(this).val();
        i += 1;
    });
    var multiMagnet = arr.join("\r\n");
    if(confirm("即将进行磁链多行复制操作，确认进行？")){
        GM_setClipboard(multiMagnet);
    }
}
function checkAll(){
    jQuery(".checkMagnet").each(function(){
        if(jQuery(this).get(0).checked != jQuery("#checkAll").get(0).checked){
            jQuery(this).get(0).click()
        }
    });
}
function convertToBase16(base32){
    var hex = "0123456789ABCDEF";
    var strHex = "";
    //获得解码后的无符号字节数组
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
