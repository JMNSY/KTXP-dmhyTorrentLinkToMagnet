KTXP-dmhyTorrentLinkToMagnet
============================
JavaScript用户脚本


脚本作用：<br/>
使用户能从多个BT资源站点中获取到16位编码的磁链，使之能加入各种离线任务，包括迅雷离线，115；也可以批量添加到transmission

关于dmhy中的功能链接：<br/>
1.排在最上方的加号链接的作用是，把目前勾选的磁链追加到浏览器本地存储，在此之后把本地存储的内容放入剪贴板，功能与预想不同的时候，请先点击一次垃圾桶链接，清除本地存储中的历史<br/>
2.排在中间的垃圾桶链接作用是，清空本地存储，并把空字符串放入剪贴板<br/>
3.排在最下方的复制链接作用与原来不变，把目前勾选的磁链放到剪贴板<br/>
4.按下快捷键shift+f1相当于点击加号链接<br/>
5.按下快捷键shift+f2相当于点击垃圾桶链接<br/>
6.按下快捷键shift+f4相当于点击复制链接（不使用f3的原因是f3有搜索的功能，在按下组合键之后可能会弹出搜索框）<br/>
7.按下快捷键esc相当于点击设定链接

关于快捷键的设置<br/>
快捷键由mousetrap提供支持，支持类似下列的快捷键（区分大小写）：<br/>
1.shift+f1 按住shift的情况下，按f1<br/>
2.a s d 按a，松开，按s，松开，按d，松开（输入时也会触发，慎用）<br/>
3.esc 按esc键<br/>
4.command 按command键（按其他快捷键时也可能会触发，慎用）<br/>
5.ctrl 按ctrl键（按其他快捷键时，例如ctrl+c也可能会触发，慎用）

目前支持：<br/>
1.share.dmhy.org<br/>
2.bt.acg.gg<br/>
3.miobt.com<br/>
4.dmhy.dandanplay.com<br/>
5.comicat.org<br/>
6.kisssub.org

//TODO List：<br/>
1.以界面改动小为前提，使用户能复制多行磁链（已在dmhy实现）<br/>
2.改进base64编码函数使之能编码汉字(我敢担保这个功能已经跟这个脚本没关系了wwwww)

Change Log：

2016-06-20 23:23<br/>
1.添加了3个网站的支持

2016-06-09 23:08<br/>
1.新增设置，用于隐藏右下角的操作图标，之后只可以用快捷键操作（因此需要谨慎操作）

2016-05-15 02:28<br/>
1.修复了页面处于最后一页但不是首页时跳转组件不显示的问题<br/>
2.增加了跳转输入框的回车监听

2016-05-15 01:37<br/>
1.磁链是否带tracker设置在保存后不需要刷新，立即生效<br/>
2.显示节目单全表，列表固定从周日排列到周六<br/>
3.增加页面直达，输入页码点击前往即可

UTC 2016-04-01 17:33<br/>
1.添加设置界面<br/>
2.将快捷键，种子下载链是否显示，是否带tracker用设置的方式保存

2016-03-19 13:55<br/>
1.修复焦点在输入框等特殊元素时快捷键无效的问题

2016-03-19 13:04<br/>
1.添加简单的快捷键操作，shift+f1追加磁链，shift+f2清空剪贴板，shift+f4多行复制<br/>
2.去除对漫游BT的支持<br/>
3.去除对dmhy单个资源详情页的支持

2015-12-19 11:32<br/>
1.为避免图片存储服务器得知图片在浏览什么网站时被加载，使用用户脚本管理插件提供的接口，在去掉referer的情况下获得图片<br/>
2.将图片用base64编码显示

2015-12-12 03:08<br/>
1.再dmhy新增跨页追加剪贴板磁链功能和清空剪贴板功能<br/>
2.更改了使用的图标<br/>
3.将过去引用他人的函数改为使用自编base32 to hex的函数<br/>
4.更改过去在脚本中存储图标的方式

2015-08-30 10:44<br/>
1.在dmhy添加复选框和全选框，在窗口右下角添加一个固定组件，选择要复制的磁链后点击该组件，确认要复制后多行的磁链就复制到剪贴板中。<br/>
2.代码中添加dmhy种子链显示开关，true为显示，false为不显示

2015-08-30 05:30<br/>
1.替换dmhy资源页中的磁链（不对弹幕播放链接中的磁链进行处理，花园这么写应该能用的吧？不能用的话说一声我把这个也换掉）<br/>
2.支持share.popgo.org<br/>
3.对dmhy列表页新增种子链<br/>
4.对代码进行注释

作者的话：<br/>
有时候觉得是不是这脚本对网页干涉太多了，全部替换掉的话要是有人要base32编码的怎么办？<br/>
正当我烦恼得吃不好睡不着的时候，突然醒悟，用户只要禁用这个脚本不就好了么？
