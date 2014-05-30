TodoListAndNotes
================


local todolist and  notes web application using node.js

一 环境准备<BR>
1 mysql安装<br>
2 用doc目录下的sql建表<br>
3 配置settings.js文件：mysql访问地址以及密码，database，以及一些缺省的值<br>

二 安装<br>
1  npm install --registry=http://r.cnpmjs.org <br>
or npm install --registry=http://registry.npm.taobao.org
<br>
2  node app.js or supervisor app.js for debug<br>

三 完成前面两步之后可以通过<br>
  http://localhost:8000/访问，默认不开启密码访问，只能本机访问（限制127.0.0.1的ip访问）



<Strong>使用说明</Strong><br>
<font color="red"><strong>这个系统能解决什么问题or目的</strong></font>：<br>
     1 这个系统是我自己开发来管理记录琐碎的事情的：oa上线流程跟踪，开发各种业务之间交互的沟通，各个系统调用，新需求的叠加，未来任务排期等等，最主要的是工作期间老被打断，（以前我也用wps文档记录各种琐碎的事情，后来发现时间越长，这个系统价值越高）。<br>
     2 我比较懒，以及学习的东西多，笔记管理也出奇的乱:linux系统配置，开发环境搭建，git svn  spring  android用法的，等等都不少，如果存放在硬盘上，查找这些东西要在各个文件夹下面找倒不如在这个系统中search，目前可以对查询出来的结果高亮显示key word
     
目前页面部分todolist以及notes需要自己用html语法调整输出格式
为了显示格式化文字或者代码，可以使用pre 或者 xmp（最好）标签
