var User = require('../models/user');
var express = require('express.io');
var moment = require("moment");
var merge = require('merge');
var url = require('url');
var settings = require('../settings')[process.env.NODE_ENV || 'dev'];
var router = module.exports = new express.Router();
var NoteList = require('../models/cal/NoteList');

//
router.get('/showNoteList', User.checkLogin);
router.get('/showNoteList', function (req, res) {
	console.log("/showNoteList,params:%s", JSON.stringify(req.query));
  listNoteList(req, res);
});

//
router.post('/addNoteList', User.checkLogin);
router
    .post('/addNoteList', function (req, res) {
    	var date = new moment(req.body.date).format('YYYY-MM-DD');
    	
    	console.log("/addNoteList,params:%s,date:%s", JSON.stringify(req.body),date);
    	var nameSpace = req.body.namespace;
    	if(!nameSpace)//默认帅选公司的笔记
    		nameSpace = settings.defaultNameSpace;
    	var category = req.body.category;
    	if(!category)//默认
    		category = settings.defaultCategory;
    	
      NoteList.add(date,
    		  namespace,
    		  category,
    		  req.body.title,
    		  req.body.content,
    		  req.body.topflag,
    		  function(){
    	  		console.log("add success");
      		 });
      
      listNoteList(req, res);
    });
//
router.post('/updateStatus', User.checkLogin);
router.post('/updateStatus', function (req, res) {
  console.log("/updateStatus,params:%s", JSON.stringify(req.body));
  if (req.body.id) {
    NoteList.updateStatus(req.body.id);
  }
  // show rules
  listNoteList(req, res);
});

router.post('/updateContent', User.checkLogin);
router.post('/updateContent', function (req, res) {
  console.log("/updateContent,params:%s", JSON.stringify(req.body));
  if (req.body.id) {
    NoteList.updateContent(req.body.id,
    		req.body.title,
    		req.body.namespace,
    		req.body.category,
    		req.body.topflag,
    		req.body.content);
  }
  // show rules
  listNoteList(req, res);
});

function listNoteList (req, res) {
	
	//var url_args = url.parse(req.url).query;
	//console.log("/listNoteList,params:%s id:%d", JSON.stringify(url_args),req.param("id"));
	
	var paramId = req.param("id");
	var paramKeyWords = req.param("searchKeyWords");
	var nameSpace = req.param("searchNameSpace");
	var category = req.param("searchCategory");
	//var noteListObj = new NoteList();
	//if(!nameSpace)//默认帅选公司的笔记
	//	nameSpace = settings.defaultNameSpace;

	NoteList.query(paramId,paramKeyWords,nameSpace,category,
			function (err, NoteLists) {
	  if (!err && NoteLists) {
         for (var i = 0; i < NoteLists.length; i++) {// 页面日期显示格式化
    	  NoteLists[i].createTime = new moment(NoteLists[i].createTime).format('YYYY-MM-DD HH:mm:ss');
    	  NoteLists[i].modifyTime = new moment(NoteLists[i].modifyTime).format('YYYY-MM-DD HH:mm:ss');
    	  NoteLists[i].date = new moment(NoteLists[i].date).format('YYYY-MM-DD');
    	  //查询结果过滤
    	  if(paramKeyWords){
    		  var keys = paramKeyWords.split(',');
    		  for(var j=0;j<keys.length;j++){

    			  var trueKeysArray = NoteLists[i].content.match(new RegExp(keys[j],"gmi"));//过滤多次一样的
    			  //console.log("/listNoteList,trueKeysArray:%s", JSON.stringify(trueKeysArray));
    			  trueKeysArray = unique(trueKeysArray);
    			  //console.log("/listNoteList,trueKeysArray:%s", JSON.stringify(trueKeysArray));
    			  if(trueKeysArray && trueKeysArray.length>0){
    				  for(var k=0;k<trueKeysArray.length;k++)
    					  NoteLists[i].content = NoteLists[i].content.replace(new RegExp(trueKeysArray[k],"gm"),"<font color='red'>"+trueKeysArray[k]+"</font>");
    			  }
          	  }
    		  //NoteLists[i].content = getStrLimitByLen(NoteLists[i].content,500);//toLowerCase比较
    	  }
    	  //可以过滤内容长度显示
    	  else if(!req.param("id")){
    		  NoteLists[i].content = getStrLimitByLen(NoteLists[i].content,500);
    	  }

      }

    } else
    	NoteLists = [];

    // console.log("query NoteLists:%s",JSON.stringify(NoteLists));
    res.render('./notes/showNoteList', {
      title : 'showNoteList',
      user : User.getSessionUser(req),
      result : merge(req.body, {
    	  NoteLists : NoteLists,
    	  editable:req.param("id")
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

  if(sum+1 >= length)
	  return strTemp.substring(0,i+1) + "   ...";
 }  
 
}
//网上找的，去掉字符数组中重复元素
//例如，var aa=['a','a','A','中国','中国']
function unique(data){  
    data = data || [];  
        var a = {};  
    for (var i=0; i<data.length; i++) {  
        var v = data[i];  
        if (typeof(a[v]) == 'undefined'){  
            a[v] = 1;  
        }  
    };  
    data.length=0;  
    for (var i in a){  
        data[data.length] = i;  
    }  
    return data;  
}  