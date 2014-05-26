var crypto = require('crypto');
var User = require('../models/user');
var settings = require('../settings')[process.env.NODE_ENV || 'dev'];
var express = require('express.io');
var merge = require('merge');
var router = module.exports = new express.Router();

// 登录后创建新用户
router.get('/reg', User.checkLogin);
router.get('/reg', function (req, res) {
  renderReg(req, res, {});
});

//需要登陆之后才能创建user
router.post('/reg', User.checkLogin);
router.post('/reg',function (req, res) {
	var name = req.body.name, password = req.body.password, password_re = req.body['passwordRepeat'];
	if (password_re != password) {
		return renderReg(req, res, {
			tip : '两次输入的密码不一致!'
            });
          }
	var md5 = crypto.createHash('md5'), password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name : req.body.name,
		password : password,
		email : req.body.email
		});
	console.info("newUser is:%s",JSON.stringify(newUser));
	User.get(newUser.name, function (err, user) {
		if (!isEmptyObject(user)) {
			console.info("用户已存在! user is:%s",JSON.stringify(user));
			return renderReg(req, res, {
				tip : '用户已存在!'
			});
		}
		else
			console.info("对象不存在！");
			
		newUser.save(function (err, user) {
			if (err) {
                return renderReg(req, res, {
                  tip : JSON.stringify(err)
                });
              }
              req.session.user = user;
              res.redirect('/');
		});
	});
		
});

router.get('/login', User.checkNotLogin);
router.get('/login', function (req, res) {
  renderLogin(req, res, {});
});

router.post('/login', User.checkNotLogin);
router.post('/login', function (req, res) {
  var md5 = crypto.createHash('md5'), password = md5.update(req.body.password)
      .digest('hex');
  //console.info("name:%s,password:%s,password md5:%s",req.body.name,req.body.password,password);
  User.get(req.body.name, function (err, user) {
    if (!user) {
      return renderLogin(req, res, {
        tip : '用户不存在!'
      });
    }
    if (user.password != password) {
      return renderLogin(req, res, {
        tip : '密码错误!'
      });
    }
    req.session.user = user;
    if (req.body.returnurl) {
      res.redirect(req.body.returnurl);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/logout', User.checkLogin);
router.get('/logout', function (req, res) {
  if (settings.enableSession) {
    req.session.user = null;
  }
  res.redirect('/');
});

function renderLogin (req, res, result) {
  return res.render('./user/login', {
    title : '登录',
    user : {},
    result : merge(req.query, req.body, result)
  });
}

function renderReg (req, res, result) {
  return res.render('./user/reg', {
    title : '注册',
    user : {},
    result : merge(req.body, result)
  });
}

function isEmptyObject( obj ) {
	if(!obj.length)
		return true;
	console.info("length:%d",!obj.length);
	if(obj==null)
		return true;
	
	for ( var name in obj ) {
		return false;
	}
	return true;
}
