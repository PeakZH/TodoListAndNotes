var express = require('express.io');
var User = require('../models/user');
var router = module.exports = new express.Router();
var merge = require('merge');
var Category = require('../models/cal/Category');
var NoteList = require('../models/cal/NoteList');

//router.get('/', User.checkLogin);
router.get('/', function (req, res) {
    if (User.getSessionUser(req)) {
    	NoteList.queryCategory(function(err,categorys){
	    var namespaceArray=[];
	    var namespace2categoryArray=[];
	    var notesSum = 0;//笔记总数

	    categorys.forEach(function(category,index){
		//console.log("namespace:%s %d",category.namespace,index);
		notesSum += category.count;
		if(namespaceArray.length ==0){
		    namespaceArray[0]=category.namespace;
		    namespace2categoryArray[0]={namespace:category.namespace,categoryNotesSum:category.count,data:[]};
		    namespace2categoryArray[0].data[0]={category:category.category,count:category.count};
		}
		else{
		    var index=-1;
		    for(var i=0;i<namespaceArray.length;i++){
			if(namespaceArray[i]==category.namespace){
			    index=i;
			}
		    }
		    if(index == -1){//之前没有保存命名空间
			index=namespaceArray.length;
			namespaceArray[index]=category.namespace;
			namespace2categoryArray[index]={namespace:category.namespace,categoryNotesSum:category.count,data:[]};
			namespace2categoryArray[index].data[0]={category:category.category,count:category.count};
		    }
		    else{//已经有命名空间
			//namespaceArray[index]=category.namespace;
			len = namespace2categoryArray[index].data.length;//文章分类坐标
			namespace2categoryArray[index].categoryNotesSum += category.count;
			namespace2categoryArray[index].data[len]={category:category.category,count:category.count};
		    }	
		}
	    });	
		var countByMonth = [];
	    	NoteList.queryByMonth(function(err,result){
		    countByMonth=result;
		    //console.log("countByMonth %s",JSON.stringify(countByMonth));
		    res.render('./index', {
			title : 'index',
			user : User.getSessionUser(req),
			result : merge(req.body, {
			    notesSum:notesSum,
			    categorys:namespace2categoryArray,
			    countByMonth:countByMonth,
			    test : 'test'
			})
		    });
		});


    	});
    	
    } else {
    	res.render('./user/login', {
    	    title : '登录',
    	    user : {},
    	    result : merge({tip : '访客，限制ip访问!'},
    	    		req.query, req.body, result)
    	  });
    }
 });
