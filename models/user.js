var pool = require('./mongodb');
var settings = require('../settings')[process.env.NODE_ENV || 'dev'];

function User (user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
}

module.exports = User;

// 存储用户信息
User.prototype.save = function (callback) {
  // 要存入数据库的用户文档
  var user = {
    name : this.name,
    password : this.password,
    email : this.email
  };
  // 打开数据库
  pool.acquire(function (err, db) {
    if (err) {
      return callback(err);// 错误，返回 err 信息
    }
    // 读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        pool.release(db);
        return callback(err);// 错误，返回 err 信息
      }
      // 将用户数据插入 users 集合
      collection.insert(user, {
        safe : true
      }, function (err, user) {
        pool.release(db);
        if (err) {
          return callback(err);// 错误，返回 err 信息
        }
        callback(null, user[0]);// 成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

// 读取用户信息
User.get = function (name, callback) {
  // 打开数据库
  pool.acquire(function (err, db) {
    if (err) {
      return callback(err);// 错误，返回 err 信息
    }
    // 读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        pool.release(db);
        return callback(err);// 错误，返回 err 信息
      }
      console.info("User.get collection is :%s",collection);
      // 查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name : name
      }, function (err, user) {
     // collection.find(function (err, user) {
        pool.release(db);
        if (err) {
          return callback(err);// 失败！返回 err 信息
        }
        console.info("User.get collection.find user is :%s",JSON.stringify(user));
        callback(null, user);// 成功！返回查询的用户信息
      });
    });
  });
};

User.checkLogin = function (req, res, next) {
  console.log("request ip addr:" + req.connection.remoteAddress + " date: " + new Date());
  if (settings.enableSession) {
      if(!req.session ||!req.session.user){
    	 req.flash('error', '未登录!');
    	 res.redirect('/user/login?returnurl='
    		+ encodeURIComponent(req.originalUrl));  
	}
	console.info("session user is %s",JSON.stringify(req.session.user));
  }
  else{// if(req.connection.remoteAddress == '127.0.0.1' || 
  //req.connection.remoteAddress  == '::1'){//限制本地ip
      console.log("call localhost");
      next();
  }
  /*else{
	res.redirect('/user/login?returnurl='
		+ encodeURIComponent(req.originalUrl)); 
  }*/
};

User.checkNotLogin = function (req, res, next) {
  if (settings.enableSession && req.session.user) {
    req.flash('error', '已登录!');
    res.redirect('back');
  }
  next();
};

User.getSessionUser = function (req) {
  if (!settings.enableSession) {
    console.info("session user is guest");
    var user = {name : "guest",
	password :"guest",email : "email"};
    return user;
  } else if (req.session) {
      console.info("session user is req.session");
    return req.session.user;
  } else {
      console.info("session user is default");
    return null;
  }
};
