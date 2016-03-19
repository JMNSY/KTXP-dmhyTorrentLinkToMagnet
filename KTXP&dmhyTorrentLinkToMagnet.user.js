// ==UserScript==
// @name             KTXP&dmhyTorrentLinkToMagnet
// @namespace        http://KTXP&dmhyTorrentLinkToMagnet/
// @version          2.99
// @description      将dmhy的超长磁链换成btih为40个字符长度的磁链，对另外两个站的列表页新增磁力链接 PS:沿用这个脚本并不是因为我认为bt.acg.gg或www.miobt.com跟极影有任何关系，只是受众有重叠
// @match            http://bt.acg.gg/*
// @match            http://www.miobt.com/*
// @match            http://miobt.com/*
// @match            https://share.dmhy.org
// @match            https://share.dmhy.org/topics/list*
// @require          http://code.jquery.com/jquery-1.9.0.min.js
// @require          https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js
// @grant            GM_setClipboard
// @grant            GM_xmlhttpRequest
// @license          GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright        2014.01.17, JMNSY
// ==/UserScript==
jQuery().ready(function(){
    jQuery.noConflict();
    var isShowTorrent = true;
    var link;
    var switchy;
    var copyimg = "https://jmnsyscripts.sinacloud.net/black-tie-bold-2f74f123f4edd720c202dbfac55ab2a8454e5785fddb6975b2d8d1d0ebc6f45f.png";
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
        GM_xmlhttpRequest({
            method: 'GET',
            url: copyimg,
            headers: {
                'User-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'Accept': 'image/png',
                'referer':'',
            },
            onload: function(responseDetails) {
                var imgBin = responseDetails;
                var base64 = customBase64Encode(responseDetails.responseText);
                copyimg = "data:image/png;base64," + base64;
                var copyIt = jQuery("<div/>",{id:"copySelectedMagnet",title:"多行複製"}).on("click",copyMagnet).css({
                    "background":"url(" + copyimg + ") -485px -285px",
                    //   "background-size":"contain",
                    "background-repeat":"no-repeat",
                    "padding":"15px 15px",
                    "position":"fixed",
                    "right":"5px",
                    "bottom":"90px",
                    "cursor":"pointer"
                });
                var addIt = copyIt.clone().css({"bottom":"195px","background":"url(" + copyimg + ") -85px -45px"}).attr({"id":"addSelectedMagnet","title":"追加磁鏈"}).on("click",addLocalStorage);
                var clearIt = copyIt.clone().css({"bottom":"160px","background":"url(" + copyimg + ") -565px -45px"}).attr({"id":"clearMagnet","title":"清空剪貼簿"}).on("click",clearLocalStorageAndClipboard);
                jQuery("body").append(copyIt).append(addIt).append(clearIt);
            },
            overrideMimeType: 'text/plain; charset=x-user-defined'
        });
        //shift+f1追加磁链
        Mousetrap.bind('shift+f1', addLocalStorage);
        //shift+f2清空剪贴簿
        Mousetrap.bind('shift+f2', clearLocalStorageAndClipboard);
        //shift+f4多行复制
        Mousetrap.bind('shift+f4', copyMagnet);
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
                var b16 = base32ToHex(b32);
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
        });
    }
    //当前处理的页面是dmhy的情况下
    if(switchy == 0 && temp != null){
        var checkall = jQuery("<input/>",{type:"checkbox",id:"checkAll",title:"全選"});
        //在表头添加全选复选框
        jQuery("span.title").eq(3).before(checkall).parent();
        //对全选复选框和其他复选框监听变更事件
        jQuery("#checkAll").on("change",checkAll);
        jQuery(".checkMagnet").on("change",checkThis);
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
    else if(switchy == 3){
        //我自己画的，有意见你就帮我画一个
        //对miobt.com中，由该脚本新增的链接添加样式，使链接有足够面积被点击，并以有明显意义的图标作为背景
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://jmnsyscripts.sinacloud.net/magnet.gif",
            headers: {
                'User-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'Accept': 'image/gif',
                'referer':'',
            },
            onload: function(responseDetails) {
                var imgBin = responseDetails;
                var base64 = customBase64Encode(responseDetails.responseText);
                var imgstr = "data:image/gif;base64," + base64;
                jQuery("a.magnet").css({"background":"url(" + imgstr + ")","background-size":"contain","background-repeat":"no-repeat","padding-left":"15px"});
            },
            overrideMimeType: 'text/plain; charset=x-user-defined'
        });
    }
});
function copyMagnet(){
    var i = 0;
    var arr = new Array("");
    jQuery(".checkMagnet:checked").each(function(){
        arr[i] = jQuery(this).val();
        i += 1;
    });
    var multiMagnet = arr.join("\r\n");
    if(confirm("即將進行磁鏈多行複製操作，確認進行？")){
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
function checkThis(){
    if(jQuery(this).get(0).checked == false){
        jQuery("#checkAll").get(0).checked=false;
    }
    else if(jQuery(this).get(0).checked == true && jQuery(".checkMagnet:checked").length == jQuery(".checkMagnet").length){
        jQuery("#checkAll").get(0).checked=true;
    }
}
function isNone(str){
    return str == null || str == "";
}
var localMap = {};
function addLocalStorage(){
    var i = 0;
    var arr = new Array();
    var multiMagnet = localStorage.getItem("multiMagnet");
    jQuery(".checkMagnet:checked").each(function(){
        var thisMagnet = jQuery(this).val();
        if( localMap[thisMagnet] == undefined){
            arr[i] = thisMagnet;
            localMap[thisMagnet] = true;
            i += 1;
        }
        else if(Object.getOwnPropertyNames(localMap).length == 0){
            localArr = localStorage.getItem("multiMagnet").split("\r\n");
            for(var j in localArr){
                localMap[localArr[j]] = true;
            }
        }
    });
    var add = "";
    if(confirm("即將追加選中的磁鏈到剪貼簿，確認進行？")){
        if(arr.length > 0){
            add = arr.join("\r\n");
            var clipbordStr = ((multiMagnet == null) || (multiMagnet == "")?"":multiMagnet + "\r\n") + add;
            localStorage.setItem("multiMagnet",clipbordStr)
            GM_setClipboard(clipbordStr);
        }
        else{
            GM_setClipboard(multiMagnet);
            return;
        }
    }
}
function clearLocalStorageAndClipboard(){
    if(confirm("即將清除快取和剪貼簿中的内容，確認進行？")){
        localStorage.setItem("multiMagnet","");
        GM_setClipboard("");
        localMap = {};
    }
}
function base32ToHex(str){
	if(str.length % 8 != 0){
		return null;
	}
	str = str.toLowerCase();
	var b32 = {'a':'00000','b':'00001','c':'00010','d':'00011','e':'00100','f':'00101','g':'00110','h':'00111','i':'01000','j':'01001','k':'01010','l':'01011','m':'01100','n':'01101','o':'01110','p':'01111','q':'10000','r':'10001','s':'10010','t':'10011','u':'10100','v':'10101','w':'10110','x':'10111','y':'11000','z':'11001','2':'11010','3':'11011','4':'11100','5':'11101','6':'11110','7':'11111'};
	var b16 = {'0000':'0','0001':'1','0010':'2','0011':'3','0100':'4','0101':'5','0110':'6','0111':'7','1000':'8','1001':'9','1010':'a','1011':'b','1100':'c','1101':'d','1110':'e','1111':'f'};
	var bin = "";
	var returnStr = "";
	for(var i = 0;i < str.length;i++){
		bin += b32[str.substring(i,i+1)];
	}
	for(var i = 0;i < bin.length;i+=4){
		returnStr += b16[bin.substring(i,i+4)];
	}
	return returnStr;
}
function customBase64Encode (inputStr) {
    var
        bbLen               = 3,   //3字节一组
        enCharLen           = 4,   //3字节转换成4个base64编码字符
        inpLen              = inputStr.length,   //图片str的长度
        
        inx                 = 0,
        jnx,   //字节读入时使用的下标
        keyStr              = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                            + "0123456789+/=",   //转换用字符串
        output              = "",   //输出字符串
        paddingBytes        = 0;   //决定最后一组等号的个数
    var
        bytebuffer          = new Array (bbLen),   //三字节一组
        encodedCharIndexes  = new Array (enCharLen);   //转换成4字符
    //对图片str的每一个字节
    while (inx < inpLen) {
        //每次把下标初始化为0，读入三个字节
        for (jnx = 0;  jnx < bbLen;  ++jnx) {
            
            //以ascii读入三个字节，存储到数组中
            if (inx < inpLen)
                bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
            //当图片str的长度不为3的倍数时，剩余的位数置零
            else{
                bytebuffer[jnx] = 0;
                inx+=1;
            }
        }

        //base64编码第一个字符为第一个字节右移两位
        encodedCharIndexes[0] = bytebuffer[0] >> 2;
        //base64编码第二个字符为第一个字节和00000011b作与运算并左移四位的结果与第二个字节右移四位的结果作并运算
        encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4)   |  (bytebuffer[1] >> 4);
        //base64编码第三个字符为第二个字节保留右边4位并左移2位的结果与第三个字节右移6位的结果作并运算
        encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2)  |  (bytebuffer[2] >> 6);
        //base64编码第四个字符为第三个字节保留右边6位
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;
        
        paddingBytes          = inx - inpLen;
        switch (paddingBytes) {
            case 1:
                encodedCharIndexes[3] = 64;
                break;
            case 2:
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;
            default:
                break; // No padding - proceed
        }
        
        for (jnx = 0;  jnx < enCharLen;  ++jnx)
            output += keyStr.charAt ( encodedCharIndexes[jnx] );
    }
    return output;
}
