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
    	var namespace = req.body.namespace;
    	if(!namespace)//默认帅选公司的笔记
    		namespace = settings.defaultNameSpace;
    	namespace = namespace.trim();
    	var category = req.body.category;
    	if(!category)//默认
    		category = settings.defaultCategory;
    	category = category.trim();
    	
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

router.post('/updateContent', User.checkLogin);
router.post('/updateContent', function (req, res) {
  console.log("/updateContent,params:%s", JSON.stringify(req.body));
  if (req.body.id) {
    NoteList.updateContent(req.body.id,
    		req.body.title,
    		req.body.namespace.trim(),
    		req.body.category.trim(),
    		req.body.topflag,
    		req.body.content);
  }
  // show rules
  listNoteList(req, res);
});

function listNoteList (req, res) {
	
	//var url_args = url.parse(req.url).query;
	//console.log("/listNoteList,xrf params:%s title:%s", JSON.stringify(url_args),req.param("title"));
	
	var paramId = req.param("id");
  var title = req.param("searchTitle");
	var paramKeyWords = req.param("searchKeyWords");
	var nameSpace = req.param("searchNameSpace");
	var category = req.param("searchCategory");
	var dateStart = req.param("searchDateStart");
	var orgStartDate=dateStart;
	var dateEnd = req.param("searchDateEnd");
	var orgEndDate=dateEnd;
	//var noteListObj = new NoteList();
	//if(!nameSpace)//默认帅选公司的笔记
	//	nameSpace = settings.defaultNameSpace;
	if(dateStart){
	    var dateStr = dateStart.split("/");
	    dateStart = dateStr[2] + "-" + dateStr[0] + "-" + dateStr[1];
	}

	if(dateEnd){
	    var dateStr = dateEnd.split("/");
	    dateEnd = dateStr[2] + "-" + dateStr[0] + "-" + dateStr[1];
	}

	NoteList.query(paramId,title,paramKeyWords,nameSpace,category,dateStart,dateEnd,
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
    				  for(var k=0;k<trueKeysArray.length;k++){
    					  NoteLists[i].content = NoteLists[i].content.replace(new RegExp(trueKeysArray[k],"gm"),"<font color='red'>"+trueKeysArray[k]+"</font>");
				  }
    			  }
          	  }
    	  }
    	  //可以过滤内容长度显示
    	  else if(!req.param("id")){
				      //判断xmp标签有没有，要是有增加匹配
    		  NoteLists[i].content = getStrLimitByLen(NoteLists[i].content,settings.NotesContentLengthLimit);
		  
		  var begPreArray = NoteLists[i].content.match(new RegExp("<pre>","gmi"));
			        var endPreArray = NoteLists[i].content.match(new RegExp("</pre>","gmi"));  
				//console.log("%s, %s", JSON.stringify(preXmpArray),JSON.stringify(endXmpArray));

				if(begPreArray && begPreArray.length==1 && ( !endPreArray ||endPreArray && endPreArray.length==0)){
				    NoteLists[i].content = NoteLists[i].content + " </pre>";
				}
				if((!begPreArray || begPreArray && begPreArray.length==0 )&&  endPreArray && endPreArray.length==1){
				    NoteLists[i].content =  "<pre> " + NoteLists[i].content;
				}

				var preXmpArray = NoteLists[i].content.match(new RegExp("<xmp>","gmi"));
			        var endXmpArray = NoteLists[i].content.match(new RegExp("</xmp>","gmi"));  
				//console.log("%s, %s", JSON.stringify(preXmpArray),JSON.stringify(endXmpArray));

				if(preXmpArray && preXmpArray.length==1 && ( !endXmpArray ||endXmpArray && endXmpArray.length==0)){
				    NoteLists[i].content = NoteLists[i].content + " </xmp>";
				}
				if((!preXmpArray || preXmpArray && preXmpArray.length==0 )&&  endXmpArray && endXmpArray.length==1){
				    NoteLists[i].content =  "<xmp> " + NoteLists[i].content;
				}
    	  }

      }

    } else
    	NoteLists = [];

     console.log("query NoteLists: keywords:%s  title:%s",paramKeyWords,title);
    res.render('./notes/showNoteList', {
      title : 'showNoteList',
      user : User.getSessionUser(req),
      result : merge(req.body, {
    	  NoteLists : NoteLists,
          title:title,
          keyWords :paramKeyWords,
          nameSpace :nameSpace,
          category :category,
          dateStart :orgStartDate,
          dateEnd :orgEndDate,
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
