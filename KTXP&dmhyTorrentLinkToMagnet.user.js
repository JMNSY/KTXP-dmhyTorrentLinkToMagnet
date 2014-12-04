// ==UserScript==
// @name       KTXP&dmhyTorrentLinkToMagnet
// @namespace  http://KTXP&dmhyTorrentLinkToMagnet/
// @version    2.1
// @description  在极影首页以及搜索页添加一个的绿底白箭头，链接为该资源的磁链；在动漫花园把蓝箭头的链接换成磁链。
// @match      http://bt.ktxp.com/*
// @match	   *://share.dmhy.org
// @match	   *://share.dmhy.org/topics/list*
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
    if(jQuery(".download-arrow[title='種子']").length > 0){
        link = jQuery(".download-arrow[title='種子']");
        switchy = 0;
    }
    link.each(function(){
        temp = jQuery(this).clone();
        str = jQuery(this).attr("href");
        var words = str.split("/");
        torrent = words[words.length - 1];
        hash = torrent.split(".")[0];
        magnet = "magnet:?xt=urn:btih:" + hash;
        if(switchy == 1)
            jQuery(this).before(temp.attr("href",magnet));
        else
            jQuery(this).attr("href",magnet);
    });
});
