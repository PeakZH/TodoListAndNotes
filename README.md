TodoListAndNotes
================


local todolist and  notes web application using node.js

一 环境准备
1 mysql安装
2 用doc目录下的sql建表
3 配置settings.js文件：mysql访问地址以及密码，database，以及一些缺省的值

二 安装
1. npm install --registry=http://r.cnpmjs.org 
or npm install --registry=http://registry.npm.taobao.org

2. node app.js or supervisor app.js for debug

三 完成前面两步之后可以通过
  http://localhost:8000/访问，默认不开启密码访问，只能本机访问（限制127.0.0.1的ip访问）
