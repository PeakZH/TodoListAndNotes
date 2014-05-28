var User = require('../models/user');
var express = require('express.io');
var moment = require("moment");
var merge = require('merge');
var router = module.exports = new express.Router();
var ToDoList = require('../models/cal/ToDoList');
var settings = require('../settings')[process.env.NODE_ENV || 'dev'];
//
router.get('/showToDoList', User.checkLogin);
router.get('/showToDoList', function (req, res) {
	//缺省namespace,用于分类查询 管理
  listToDoList(settings.defaultNameSpace,req, res);
});

router.get('/showPersonToDoList', User.checkLogin);
router.get('/showPersonToDoList', function (req, res) {
  listToDoList(settings.defaultPersonToDoNameSpace,req, res);
});

//
router.post('/addToDoList', User.checkLogin);
router
    .post('/addToDoList', function (req, res) {
      console.log("/addToDoList,params:%s", JSON.stringify(req.body));

      var namespace = req.body.documentURL;
      if(namespace.indexOf('Person')>-1)
    	  namespace = settings.defaultPersonToDoNameSpace;
      else
    	  namespace = settings.defaultNameSpace;
      
      ToDoList.add(namespace,req.body.content,function(){
    	  console.log("add success");
      });
      listToDoList(namespace,req, res);
    });
//
router.post('/updateStatus', User.checkLogin);
router.post('/updateStatus', function (req, res) {
  console.log("/updateStatus,params:%s", JSON.stringify(req.body));
  if (req.body.id) {
    ToDoList.updateStatus(req.body.id);
  }
  // show rules
  var namespace = req.body.documentURL;
  if(namespace.indexOf('Person')>-1)
	  namespace = settings.defaultPersonToDoNameSpace;
  else
	  namespace = settings.defaultNameSpace;
  
  listToDoList(namespace,req, res);
});

router.post('/updateContent', User.checkLogin);
router.post('/updateContent', function (req, res) {
  console.log("/updateContent,params:%s", JSON.stringify(req.body));
  if (req.body.id) {
    ToDoList.updateContent(req.body.id,req.body.content);
  }
  // show rules
  var namespace = req.body.documentURL;
  if(namespace.indexOf('Person')>-1)
	  namespace = settings.defaultPersonToDoNameSpace;
  else
	  namespace = settings.defaultNameSpace;
  
  listToDoList(namespace,req, res);
});

function listToDoList (namespace,req, res) {
	ToDoList.query(namespace,function (err, todolists) {
    if (!err && todolists) {
      for (var i = 0; i < todolists.length; i++) {// 页面日期显示格式化
    	  todolists[i].createTime = new moment(todolists[i].createTime).format('YYYY-MM-DD HH:mm:ss');
    	  todolists[i].modifyTime = new moment(todolists[i].modifyTime).format('YYYY-MM-DD HH:mm:ss');
    	  //只显示n个字符
    	  //todolist.content
      }

    } else
    	todolists = [];

    // console.log("query todolists:%s",JSON.stringify(todolists));
    res.render('./todo/showToDoList', {
      title : 'showToDoList',
      user : User.getSessionUser(req),
      result : merge(req.body, {
    	  todolists : todolists
      })
    });
  });
}
//限制显示字符内容长度
function getStrLimitByLen(strTemp,length)  
{  
    var sum;
    sum=0;  
    
    if(strTemp.length < length)
	return strTemp; 
    
    for(var i=0;i<strTemp.length;i++)  
    {  
	if ((strTemp.charCodeAt(i)>=0) && (strTemp.charCodeAt(i)<=255))  
	    sum=sum+1;  
	else  
	    sum=sum+2;
	
	if(i+1 >= length)
	    return strTemp.substring(0,i+1);
    }  
}
