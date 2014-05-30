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
目前页面部分todolist以及notes需要自己用html语法调整输出格式
为了显示格式化文字或者代码，可以使用pre 或者 xmp（最好）标签
