var express = require('express.io');
var User = require('../models/user');
var router = module.exports = new express.Router();
var merge = require('merge');
var Category = require('../models/cal/Category');

router.get('/', User.checkLogin);
router.get('/', function (req, res) {
    if (User.getSessionUser(req)) {
    	Category.query(function(err, categorys){
    		if(err || !categorys)
    			categorys = [];

    	      res.render('./index', {
    	          title : 'index',
    	          user : User.getSessionUser(req),
    	          result : merge(req.body, {
    	        	  categorys:categorys,
    	        	  test : 'test'
    	          })
    	        });
    	})
    } else {
    	res.render('./user/login', {
    	    title : '登录',
    	    user : {},
    	    result : merge({tip : '访客，限制ip访问!'},
    	    		req.query, req.body, result)
    	  });
    }
 });
