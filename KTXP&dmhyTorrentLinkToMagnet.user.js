// ==UserScript==
// @name             KTXP&dmhyTorrentLinkToMagnet
// @namespace        http://KTXP&dmhyTorrentLinkToMagnet/
// @version          3.5
// @description      将dmhy的超长磁链换成btih为40个字符长度的磁链，对另外四个站的列表页新增磁力链接 PS:沿用这个脚本并不是因为我认为这四个站跟极影有任何关系，只是受众有重叠
// @match            http://bt.acg.gg/*
// @match            http://www.miobt.com/*
// @match            http://miobt.com/*
// @match            https://share.dmhy.org
// @match            https://share.dmhy.org/topics/list*
// @include          /http:\/\/(www.)?comicat.org\/.*/
// @include          /http:\/\/(www.)?kisssub.org\/.*/
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
    var isShowTorrent = JSON.parse(getItemByDefault("isShowTorrentLink","true"));
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
        //对平时显示的节目单进行隐藏
        jQuery(".jmd").hide();
        //显示平时隐藏的全周节目单，，并加上平时节目单的class，用于配合原本样式和可能存在的事件绑定
        jQuery(".jmd_base").show().addClass("jmd");
        //今天周几，用于节目单中的标黄强调
        var nowDay = new Date().getDay();
        var TRs = jQuery(".jmd_base >tbody> tr");
        //全周节目单从周日开始，遍历整个节目单表格行，分别加上奇偶行类和当天类，用于配合原本样式和可能存在的事件绑定
        for(var i in TRs){
            if(i == nowDay){
                TRs.eq(i).addClass("today");
            }
            if(i % 2 === 0){
                TRs.eq(i).addClass("even");
            }
            else{
                TRs.eq(i).addClass("odd");
            }
        }

        //修改表头,加宽磁链的列宽并改变列名
        if(isShowTorrent){
            jQuery("span.title").eq(3).parent().attr("width","6%");
            jQuery("span.title").eq(3).text("磁鏈 種子");
        }
        //获得原本的磁链，这里有整页所有的磁链
        link = jQuery(".download-arrow[title='磁力下載']");
        //新建全选复选框对象
        var checkall = jQuery("<input/>",{type:"checkbox",id:"checkAll",title:"全選"});
        //在表头添加全选复选框
        jQuery("span.title").eq(3).before(checkall).parent();
        //对全选复选框和其他复选框监听变更事件
        jQuery("#checkAll").on("change",checkAll);
        //对checkMagnet类的变更事件绑定全选复选框的选中变更函数
        jQuery(".checkMagnet").on("change",checkThis);

        //link以dmhy的处理方式处理
        switchy = 0;
        //当且仅当勾上显示控件图标选项时，请求图片并加载控件
        if(JSON.parse(getItemByDefault("controlVisible","true"))){
            //以图片链接，链接类型，回调函数作为参数调用方法发起去掉reffer的请求
            //对图片链接进行请求后，把相应内容交由回调函数处理
            requestNoReferer(copyimg,'image/png',dmhyAddOperation);
        }
        //鼠标按键绑定相应的函数，按键通过函数从localStorage中获取
        Mousetrap.stopCallback = function () {
            return false;
        };
        Mousetrap.bind(getItemByDefault("append","shift+f1"), addLocalStorage);
        Mousetrap.bind(getItemByDefault("delete","shift+f2"), clearLocalStorageAndClipboard);
        Mousetrap.bind(getItemByDefault("copy","shift+f4"), copyMagnet);
        Mousetrap.bind(getItemByDefault("settingsSC","esc"), showSettingDiv);

        //用可用的上一页下一页链接的href用来拼接跳转目标页的地址
        var pageControl = jQuery("a:contains('下一頁')");
        //若下一页文本不被链接元素包围
        if(pageControl.length === 0){
            //尝试上一页文本
            pageControl = jQuery("a:contains('上一頁')");
        }
        //如果上面获得了有效的结果，调用函数添加跳转组件
        for(var i in pageControl){
            if(i >= 0){
                addGoToPair(i,pageControl.eq(i));
            }
        }
    }
    //适配bt.acg.gg和miobt.com列表页
    else if(jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']").length > 0){
        link = jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']");
        if(/http[s]?:\/\/bt.acg.gg\/.*/.test(thisurl)){
            //link以bt.acg.gg的处理方式处理
            switchy = 2;
        }
        else if(/http[s]?:\/\/(www.)?miobt.com\/.*/.test(thisurl)||/http[s]?:\/\/(www.)?comicat.org\/.*/.test(thisurl)||/http[s]?:\/\/(www.)?kisssub.org\/.*/.test(thisurl)){
            //link以miobt系的处理方式处理
            switchy = 3;
            //我自己画的，有意见你就帮我画一个
            //对miobt.com中，由该脚本新增的链接添加样式，使链接有足够面积被点击，并以有明显意义的图标作为背景
            requestNoReferer("https://jmnsy.github.io/magnet.gif",'image/gif',mioAddMagnetIcon);
        }
    }
    //对列表页表格中的每一行
    if(link !== null){
        link.each(function(){
            if(switchy == 1){
                temp = jQuery(this).clone();//原本用于复制一个种子下载图标，链接改为磁链，现在用不上，说到底这个分支目前都不会走
                str = jQuery(this).attr("href");
                jQuery(this).attr("href",str.substring(0,60));
            }
            else if (switchy === 0){
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
                if(JSON.parse(getItemByDefault("hasTracker","false"))){
                    magnet = magnet + tracker;
                }
                //构成种子链
                var torrentLink = "//dl.dmhy.org/" + date + "/" + b16.toLowerCase() + ".torrent";
                //把种子下载链接的href置为种子链
                temp.attr("href",torrentLink);
                var check = jQuery("<input/>",{type:"checkbox",class:"checkMagnet",value:magnet});
                //把磁链的href置为16位磁链，在磁链图标后加入种子下载图标
                var magnetArrow = jQuery(this).attr("href",magnet).attr("data-tracker",tracker);
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
//在页面中第index个下一页或者上一页<a/>(ele)后追加用于跳转页面的组件，包括数字输入框和按钮
function addGoToPair(index,ele){
    //获取传入元素的href属性
    var href = ele.get(0).href;
    //切出页码前的字符
    var prefix = href.substring(0,href.lastIndexOf("/page/")+6);
    //切出页面参数(搜索参数一类)，当href不存在?时，suffix会被赋以href值
    var suffix = href.substring(href.lastIndexOf("?"));
    //当suffix被赋以href值，赋值为空字串
    suffix = (suffix == href?"":suffix);
    //组件的部分id字串
    var id = "index" + index;
    //声明一个输入框，id为index，并绑定enter键按下事件
    var input = jQuery("<input/>",{type:'number',min:'1',placeholder:'前往頁碼',id:id,width:'70px',height:'12px'}).on("keydown",function(event){
        if(event.keyCode == 13){
            //按下enter键则模拟点击旁边的前往按钮
            jQuery("#goto"+id).click();
        }
    });
    //声明前往按钮，点击更改窗口url
    var goto = jQuery("<a/>",{id:"goto"+id,href:'#'}).text("前　往").on("click",function(){go(prefix,id,suffix);});
    //把两个组件加入到dom树中
    ele.eq(0).parent().append(jQuery("<span/>").text("　")).append(input).append(jQuery("<span/>").text("　")).append(goto);
}
function go(prefix,id,suffix){
    //获取旁边的输入框的输入值
    var index = jQuery("#"+id).val();
    //更改窗口url
    window.location.href = prefix + index + suffix;
}
//dmhy站的操作图标返回后调用的回调函数
function dmhyAddOperation(responseDetails) {
    //将返回的图片编码成base64字串
    var base64 = customBase64Encode(responseDetails.responseText);
    copyimg = "data:image/png;base64," + base64;
    //声明图片组件按钮并插入到dom树上
    var copyIt = jQuery("<div/>",{id:"copySelectedMagnet",title:"多行複製",class:"controlIcon"}).on("click",copyMagnet).css({
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
    //设置界面关闭状态时显示，显示状态时关闭
    if(jQuery("#settingDiv").length === 0){
        //窗体和绑定关闭事件
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
        var appendinput = jQuery("<input/>",{id:"appendInput",type:"text"}).css("width","80px").val(getItemByDefault("append","shift+f1"));
        appenddiv.append(appendlabel).append(appendinput).appendTo(main);     //多層元素必須一次添加

        var deletediv = jQuery("<div/>",{id:"deleteSC"}).css({"margin":"2px"});
        var deletelabel = jQuery("<span/>").attr("id","deleteLabel").css({"width":"65px","display":"inline-block"}).text("清空剪貼簿:");
        var deleteinput = jQuery("<input/>",{id:"deleteInput",type:"text"}).css("width","80px").val(getItemByDefault("delete","shift+f2"));
        deletediv.append(deletelabel).append(deleteinput).appendTo(main);

        var copydiv = jQuery("<div/>",{id:"copySC"}).css({"margin":"2px"});
        var copylabel = jQuery("#deleteLabel").clone().attr("id","copyLabel").text("多行複製");
        var copyinput = jQuery("#deleteInput").clone().attr("id","copyInput").val(getItemByDefault("copy","shift+f4"));
        copydiv.append(copylabel).append(copyinput).appendTo(main);

        var settingsdiv = jQuery("<div/>",{id:"settingsSC"}).css({"margin":"2px"});
        var settingslabel = jQuery("#deleteLabel").clone().attr("id","settingsLabel").text("设定");
        var settingsinput = jQuery("#deleteInput").clone().attr("id","settingsInput").val(getItemByDefault("settingsSC","esc"));
        settingsdiv.append(settingslabel).append(settingsinput).appendTo(main);

        var showtorrentdiv = jQuery("<div/>",{id:"showTD"}).css({"margin":"2px"});
        var showtorrentlabel = jQuery("#deleteLabel").clone().attr("id","STLabel").css("width","80px").text("顯示種子鏈");
        var showtorrentcheck =  jQuery("#deleteInput").clone().attr({id:"STCheck",type:"checkbox",checked:JSON.parse(getItemByDefault("isShowTorrentLink","true"))});
        showtorrentdiv.append(showtorrentlabel).append(showtorrentcheck).appendTo(main);

        var hastrackerdiv = jQuery("<div/>",{id:"hasTracker"}).css({"margin":"2px"});
        var hastrackerlabel = jQuery("#deleteLabel").clone().attr("id","HTLabel").css("width","80px").text("磁鏈帶Tracker");
        var hastrackercheck =  jQuery("#STCheck").clone().attr({id:"HTCheck",checked:JSON.parse(getItemByDefault("hasTracker","false"))});
        hastrackerdiv.append(hastrackerlabel).append(hastrackercheck).appendTo(main);

        var controlVisiblediv = jQuery("<div/>",{id:"controlVisible"}).css({"margin":"2px"});
        var controlVisiblelabel = jQuery("#deleteLabel").clone().attr("id","CVLabel").css("width","80px").text("显示控件图标");
        var controlVisiblecheck =  jQuery("#STCheck").clone().attr({id:"CVCheck",checked:JSON.parse(getItemByDefault("controlVisible","true"))});
        controlVisiblediv.append(controlVisiblelabel).append(controlVisiblecheck).appendTo(main);
    }
    else{
        saveAndClose();
    }
}
//从localStorage中获取name对应的值，不存在时设为defaultValue并返回defaultValue的值
function getItemByDefault(name,defaultValue){
    var item = localStorage.getItem(name);
    if(isNone(item)){
        item = defaultValue;
        localStorage.setItem(name,defaultValue);
    }
    return item;
}

//关闭并保存设置
function saveAndClose(){
    //获取设置参数
    var appendSC = jQuery("#appendInput").val();
    var deleteSC = jQuery("#deleteInput").val();
    var copySC = jQuery("#copyInput").val();
    var STFlag = jQuery("#STCheck:checked").length == 1?"true":"false";
    var HTFlag = jQuery("#HTCheck:checked").length == 1?"true":"false";
    var CVFlag = jQuery("#CVCheck:checked").length == 1?"true":"false";
    //保存设置到localStorage，重新绑定键盘按键事件
    Mousetrap.unbind(getItemByDefault("append","shift+f1"));
    localStorage.setItem("append",appendSC);
    Mousetrap.bind(getItemByDefault("append","shift+f1"), addLocalStorage);

    Mousetrap.unbind(getItemByDefault("delete","shift+f2"));
    localStorage.setItem("delete",deleteSC);
    Mousetrap.bind(getItemByDefault("delete","shift+f2"),clearLocalStorageAndClipboard);

    Mousetrap.unbind(getItemByDefault("copy","shift+f4"));
    localStorage.setItem("copy",copySC);
    Mousetrap.bind(getItemByDefault("copy","shift+f4"), copyMagnet);
    localStorage.setItem("isShowTorrentLink",STFlag);
    //遍历所有磁链箭头
    //由于页面ready的时候就在处理磁力链的时候获得tracker并保存在磁链箭头a元素的data-tracker属性中，所以在设置保存的时候就可以处理，立即生效
    jQuery(".download-arrow[title='磁力下載']").each(function(){
        var temp = jQuery(this);
        //如果勾上“磁鏈帶Tracker”
        if('true'==HTFlag){
            //在磁链后带上tracker
            temp.attr("href",temp.attr("href")+temp.attr("data-tracker"));
        }
        else{
            //把磁链中的tracker用空字串替换
            temp.attr("href",temp.attr("href").replace(temp.attr("data-tracker"),""));
        }
        //改变磁链箭头前复选框的value
        temp.prev().attr("value",temp.attr("href"));
    });
    localStorage.setItem("hasTracker",HTFlag);
    localStorage.setItem("controlVisible",CVFlag);
    //从dom中移除设置小窗
    jQuery("#settingDiv").remove();
}
//mio站的磁链图标返回后调用的回调函数
function mioAddMagnetIcon(responseDetails){
    //把磁链图标编码成base64，组成base64图片链，作为class为magnet的a元素的背景图片
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
//多行复制，不能跨页复制，不能追加，不可与追加在同一次复制中混用
function copyMagnet(){
    var i = 0;
    var arr = new Array("");
    //获取所有勾上class为checkMagnet的checkbox（每行资源所对应的checkbox），遍历
    jQuery(".checkMagnet:checked").each(function(){
        //获取该checkbox的val，即磁链，放到数组中
        arr[i] = jQuery(this).val();
        i+=1;
    });
    //把数组以换行回车连接为一个字符串
    var multiMagnet = arr.join("\r\n");
    //弹出确认对话框，用户选择积极选项时把字符串放入剪贴板
    if(confirm("即將進行磁鏈多行複製操作，確認進行？")){
        GM_setClipboard(multiMagnet);
    }
}
//全选
function checkAll(){
    //获取所有资源所对应的checkbox，遍历
    jQuery(".checkMagnet").each(function(){
        //当全选复选框与当前复选框的勾选状态不一样时
        if(jQuery(this).get(0).checked != jQuery("#checkAll").get(0).checked){
            //点击当前复选框
            jQuery(this).get(0).click();
        }
    });
}
//全选状态的临界状态处理，即全选到差一个全选，以及差一个全选到全选
function checkThis(){
    //如果当前checkbox不被勾上
    if(jQuery(this).get(0).checked === false){
        //全选复选框也不可以被勾上
        jQuery("#checkAll").get(0).checked=false;
    }
    //如果当前checkbox被勾上并且所有资源所对应的checkbox都被勾上
    else if(jQuery(this).get(0).checked === true && jQuery(".checkMagnet:checked").length == jQuery(".checkMagnet").length){
        //全选复选框也要被勾上
        jQuery("#checkAll").get(0).checked=true;
    }
}
function isNone(str){
    return str === null || str === "";
}
//页面变量，作用范围为两次load之间
var localMap = {};
//如果页面变量中不存在任何变量，即声明后不曾设值，则初始化
if(Object.getOwnPropertyNames(localMap).length === 0){
    //把localStorage中的多行磁链切开并为其设置
    var localArr = localStorage.getItem("multiMagnet").split("\r\n");
    for(var j in localArr){
        localMap[localArr[j]] = true;
    }
}
//追加磁链
function addLocalStorage(){
    var i = 0;
    var arr = [];
    //多行磁链
    var multiMagnet = localStorage.getItem("multiMagnet");
    //对当前勾选的复选框
    jQuery(".checkMagnet:checked").each(function(){
        //获取复选框元素的value，每个元素的value都是一条磁链
        var thisMagnet = jQuery(this).val();
        //如果页面变量中不存在这条磁链对应的值，防重
        if( localMap[thisMagnet] === undefined){
            //这条磁链插入数组
            arr[i] = thisMagnet;
            //并把页面变量中磁链对应的值设为true
            localMap[thisMagnet] = true;
            i += 1;
        }
    });
    var add = "";
    if(confirm("即將追加選中的磁鏈到剪貼簿，確認進行？")){
        //对所有不重复的磁链
        if(arr.length > 0){
            //用回车连接成一个字符串
            add = arr.join("\r\n");
            //向原有的磁链追加
            var clipbordStr = (isNone(multiMagnet)?"":multiMagnet + "\r\n") + add;
            //写入localStorage并复制
            localStorage.setItem("multiMagnet",clipbordStr);
            GM_setClipboard(clipbordStr);
        }
        else{
            GM_setClipboard(multiMagnet);
            return;
        }
    }
}
//清除剪贴板，清除localStorage中的多行磁链，页面变量置空
function clearLocalStorageAndClipboard(){
    if(confirm("即將清除快取和剪貼簿中的内容，確認進行？")){
        localStorage.setItem("multiMagnet","");
        GM_setClipboard("");
        localMap = {};
    }
}
//简单来说就是base32翻译成base2，再翻译成base16
function base32ToHex(str){
	if(str.length % 8 !== 0){
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
