// ==UserScript==
// @name             KTXP&dmhyTorrentLinkToMagnet
// @namespace        http://KTXP&dmhyTorrentLinkToMagnet/
// @version          3.0
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
// @connect          jmnsy.github.io
// @license          GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright        2014.01.17, JMNSY
// ==/UserScript==
jQuery().ready(function(){
    jQuery.noConflict();
    var isShowTorrent = JSON.parse(getSTCheck());
    var link;
    var switchy;
    var copyimg = "https://jmnsy.github.io/black-tie-bold-2f74f123f4edd720c202dbfac55ab2a8454e5785fddb6975b2d8d1d0ebc6f45f.png";
    var thisurl = window.location.href;
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
            jQuery("span.title").eq(3).text("磁鏈 種子");
        }
        link = jQuery(".download-arrow[title='磁力下載']");

        var checkall = jQuery("<input/>",{type:"checkbox",id:"checkAll",title:"全選"});
        //在表头添加全选复选框
        jQuery("span.title").eq(3).before(checkall).parent();
        //对全选复选框和其他复选框监听变更事件
        jQuery("#checkAll").on("change",checkAll);
        jQuery(".checkMagnet").on("change",checkThis);

        switchy = 0;
        requestNoReferer(copyimg,'image/png',dmhyAddOperation);
        Mousetrap.stopCallback = function () {
            return false;
        };
        Mousetrap.bind(getAppendShortCut(), addLocalStorage);
        Mousetrap.bind(getDeleteShortCut(), clearLocalStorageAndClipboard);
        Mousetrap.bind(getCopyShortCut(), copyMagnet);
        Mousetrap.bind(getSettingsShortCut(), showSettingDiv);
    }
    //适配bt.acg.gg和miobt.com列表页
    else if(jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']").length > 0){
        link = jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']");
        if(/http[s]?:\/\/bt.acg.gg\/.*/.test(thisurl)){
            switchy = 2;
        }
        else if(/http[s]?:\/\/(www.)?miobt.com\/.*/.test(thisurl)){
            switchy = 3;
            //我自己画的，有意见你就帮我画一个
            //对miobt.com中，由该脚本新增的链接添加样式，使链接有足够面积被点击，并以有明显意义的图标作为背景
            requestNoReferer("https://jmnsy.github.io/magnet.gif",'image/gif',mioAddMagnetIcon);
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
                var tracker = str.substring(str.indexOf("&"));
                //获得当前磁链的base32编码hash
                var b32 = str.split("&")[0].substring(20,52);
                //解码后编码为HEX
                var b16 = base32ToHex(b32);
                //构成磁链
                magnet = "magnet:?xt=urn:btih:" + b16;//b32;//
                if(JSON.parse(getHTCheck())){
                    magnet = magnet + tracker;
                }
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
});
//dmhy站的操作图标返回后调用的回调函数
function dmhyAddOperation(responseDetails) {
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
    var settings = copyIt.clone().css({"bottom":"55px","background":"url(" + copyimg + ") -525px -45px"}).attr({"id":"settingIcon","title":"设定"}).on("click",showSettingDiv);
    jQuery("body").append(copyIt).append(addIt).append(clearIt).append(settings);
}
//显示设置
function showSettingDiv(){
    if(jQuery("#settingDiv").length == 0){
        var all = jQuery("<div/>",{id:"settingDiv"}).css({
            "background":"#FFF",
            "width":"300px",
            "height":"200px",
            "position":"fixed",
            "bottom":"20px",
            "right":"50px"});
        all.appendTo(jQuery("body"));
        var title = jQuery("<div/>",{id:"settingDivTitle"}).css({
            "background":"#247",
            "color":"#fff",
            "width":"290px",
            "height":"20px",
            "position":"fixed",
            "bottom":"195px",
            "right":"55px"}).text("设定").appendTo(all);
        var main = jQuery("#settingDivTitle").clone().attr("id","settingMain").css({
            "background":"#cdf",
            "height":"168px",
            "color":"#000",
            "bottom":"25px"
        }).text("").appendTo(all);
        var closeIcon = jQuery("<span/>").text("(X)").css({
            "float":"right" ,
            "margin":"2px",
            "color":"#fff",
            "cursor":"pointer"})
        .on("click",saveAndClose).appendTo(title);
        
        //配置項
        var appenddiv = jQuery("<div/>",{id:"appendSC"}).css({"margin":"2px"});
        var appendlabel = jQuery("<span/>").attr("id","appendLabel").css({"width":"65px","display":"inline-block"}).text("追加磁鏈:");
        var appendinput = jQuery("<input/>",{id:"appendInput",type:"text"}).css("width","80px").val(getAppendShortCut());
        appenddiv.append(appendlabel).append(appendinput).appendTo(main);     //多層元素必須一次添加
        
        var deletediv = jQuery("<div/>",{id:"deleteSC"}).css({"margin":"2px"});
        var deletelabel = jQuery("<span/>").attr("id","deleteLabel").css({"width":"65px","display":"inline-block"}).text("清空剪貼簿:");
        var deleteinput = jQuery("<input/>",{id:"deleteInput",type:"text"}).css("width","80px").val(getDeleteShortCut());
        deletediv.append(deletelabel).append(deleteinput).appendTo(main);
        
        var copydiv = jQuery("<div/>",{id:"copySC"}).css({"margin":"2px"});
        var copylabel = jQuery("#deleteLabel").clone().attr("id","copyLabel").text("多行複製");
        var copyinput = jQuery("#deleteInput").clone().attr("id","copyInput").val(getCopyShortCut());
        copydiv.append(copylabel).append(copyinput).appendTo(main);
        
        var settingsdiv = jQuery("<div/>",{id:"settingsSC"}).css({"margin":"2px"});
        var settingslabel = jQuery("#deleteLabel").clone().attr("id","settingsLabel").text("设定");
        var settingsinput = jQuery("#deleteInput").clone().attr("id","settingsInput").val(getSettingsShortCut());
        settingsdiv.append(settingslabel).append(settingsinput).appendTo(main);
        
        var showtorrentdiv = jQuery("<div/>",{id:"showTD"}).css({"margin":"2px"});
        var showtorrentlabel = jQuery("#deleteLabel").clone().attr("id","STLabel").css("width","80px").text("顯示種子鏈");
        var showtorrentcheck =  jQuery("#deleteInput").clone().attr({id:"STCheck",type:"checkbox",checked:JSON.parse(getSTCheck())});
        showtorrentdiv.append(showtorrentlabel).append(showtorrentcheck).appendTo(main);
        
        var hastrackerdiv = jQuery("<div/>",{id:"hasTracker"}).css({"margin":"2px"});
        var hastrackerlabel = jQuery("#deleteLabel").clone().attr("id","HTLabel").css("width","80px").text("磁鏈帶Tracker");
        var hastrackercheck =  jQuery("#STCheck").clone().attr({id:"HTCheck",checked:JSON.parse(getHTCheck())});
        hastrackerdiv.append(hastrackerlabel).append(hastrackercheck).appendTo(main);
    }
    else{
        saveAndClose();
    }
}
function getHTCheck(){
    var hasTracker = localStorage.getItem("hasTracker");
    if(isNone(hasTracker)){
         hasTracker = "false";
         localStorage.setItem("hasTracker",hasTracker);
     }
    return hasTracker;
}
function getSettingsShortCut(){
    var settingsSC = localStorage.getItem("settingsSC");
    if(isNone(settingsSC)){
         settingsSC = "esc";
         localStorage.setItem("settingsSC",settingsSC);
     }
    return settingsSC;
}
function getSTCheck(){
    var isShow = localStorage.getItem("isShowTorrentLink");
    if(isNone(isShow)){
         isShow = "true";
         localStorage.setItem("isShowTorrentLink",isShow);
     }
    return isShow;
}
function getAppendShortCut(){
    var appendSCKey = localStorage.getItem("append");
     if(isNone(appendSCKey)){
         appendSCKey = "shift+f1";
         localStorage.setItem("append",appendSCKey);
     }
    return appendSCKey;
}
function getDeleteShortCut(){
    var deleteSCKey = localStorage.getItem("delete");
     if(isNone(deleteSCKey)){
         deleteSCKey = "shift+f2";
         localStorage.setItem("delete",deleteSCKey);
     }
    return deleteSCKey;
}
function getCopyShortCut(){
    var copySCKey = localStorage.getItem("copy");
     if(isNone(copySCKey)){
         copySCKey = "shift+f4";
         localStorage.setItem("copy",copySCKey);
     }
    return copySCKey;
}
//关闭并保存设置
function saveAndClose(){
    var appendSC = jQuery("#appendInput").val();
    var deleteSC = jQuery("#deleteInput").val();
    var copySC = jQuery("#copyInput").val();
    var STFlag = jQuery("#STCheck:checked").length == 1?"true":"false";
    var HTFlag = jQuery("#HTCheck:checked").length == 1?"true":"false";
    Mousetrap.unbind(getAppendShortCut());
    localStorage.setItem("append",appendSC);
    Mousetrap.bind(getAppendShortCut(), addLocalStorage);
    
    Mousetrap.unbind(getDeleteShortCut());
    localStorage.setItem("delete",deleteSC);
    Mousetrap.bind(getDeleteShortCut(),clearLocalStorageAndClipboard);
    
    Mousetrap.unbind(getCopyShortCut());
    localStorage.setItem("copy",copySC);
    Mousetrap.bind(getCopyShortCut(), copyMagnet);
    localStorage.setItem("isShowTorrentLink",STFlag);
    localStorage.setItem("hasTracker",HTFlag);
    
    jQuery("#settingDiv").remove();
}
//mio站的磁链图标返回后调用的回调函数
function mioAddMagnetIcon(responseDetails){
    var imgBin = responseDetails;
    var base64 = customBase64Encode(responseDetails.responseText);
    var imgstr = "data:image/gif;base64," + base64;
    jQuery("a.magnet").css({"background":"url(" + imgstr + ")","background-size":"contain","background-repeat":"no-repeat","padding-left":"15px"});
}
//以url,返回类型和回调函数作为参数调用的函数
//用于不传referer请求，缺点是不会检查文件是否变更过(不会304)
function requestNoReferer(url,accept,func){
    GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'Accept': accept,
                'referer':'',
            },
            onload: function(responseDetails){
                func(responseDetails);
            } ,
            overrideMimeType: 'text/plain; charset=x-user-defined'
        });
}
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
            jQuery(this).get(0).click();
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
            localStorage.setItem("multiMagnet",clipbordStr);
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
