var express = require('express.io');
var User = require('../models/user');
var router = module.exports = new express.Router();
var merge = require('merge');
var Category = require('../models/cal/Category');
var NoteList = require('../models/cal/NoteList');

router.get('/', User.checkLogin);
router.get('/', function (req, res) {
    if (User.getSessionUser(req)) {
    	NoteList.queryCategory(function(err,categorys){
	    var namespaceArray=[];
	    var namespace2categoryArray=[];
	    categorys.forEach(function(category,index){
		//console.log("%s %d",category.namespace,index);
		if(namespaceArray.length ==0){
		    namespaceArray[0]=category.namespace;
		    namespace2categoryArray[0]={namespace:category.namespace,data:[]};
		    namespace2categoryArray[0].data[0]={category:category.category,count:category.count};
		}
		else{
		    var index=-1;
		    for(var i=0;i<namespaceArray.length;i++){
			if(namespaceArray[i]==category.namespace){
			    index=i;
			}
		    }
		    if(index == -1){
			index=namespaceArray.length;
			namespaceArray[index]=category.namespace;
			namespace2categoryArray[index]={namespace:category.namespace,data:[]};
			namespace2categoryArray[index].data[0]={category:category.category,count:category.count};
		    }
		    else{
			//namespaceArray[index]=category.namespace;
			len = namespace2categoryArray[index].data.length;
			namespace2categoryArray[index].data[len]={category:category.category,count:category.count};
		    }	
		}
	    });	
		var countByMonth = [];
	    	NoteList.queryByMonth(function(err,result){
		    countByMonth=result;
		    console.log("%s",JSON.stringify(countByMonth));
		    res.render('./index', {
			title : 'index',
			user : User.getSessionUser(req),
			result : merge(req.body, {
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
