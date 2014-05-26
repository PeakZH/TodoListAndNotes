var User = require('../models/user');
var express = require('express.io');
var moment = require("moment");
var merge = require('merge');
var router = module.exports = new express.Router();
var OAWorkList = require('../models/cal/OAWorkList');
var settings = require('../settings')[process.env.NODE_ENV || 'dev'];

router.get('/showOAWorkList', User.checkLogin);
router.get('/showOAWorkList', function (req, res) {
  listOAWorkList(req, res);
});
router.post('/addOAWorkList', User.checkLogin);
router
    .post('/addOAWorkList', function (req, res) {
      console.log("/addOAWorkList,params:%s", JSON.stringify(req.body));

      OAWorkList.add(req.body.content,function(){
    	  console.log("add success");
      });
      listOAWorkList(req, res);
    });
router.post('/updateStatus', User.checkLogin);
//状态由初始状态转成功！
router.post('/updateStatus', function (req, res) {
  console.log("/updateStatus,params:%s", JSON.stringify(req.body));
  if (req.body.id) {
    OAWorkList.updateStatus(req.body.id);
  }
  // show rules
  listOAWorkList(req, res);
});

router.post('/updateContent', User.checkLogin);
router.post('/updateContent', function (req, res) {
  console.log("/updateContent,params:%s", JSON.stringify(req.body));
  if (req.body.id) {
    OAWorkList.updateContent(req.body.id,req.body.content);
  }
  // show rules
  listOAWorkList(req, res);
});

function listOAWorkList (req, res) {
	OAWorkList.query(settings.defaultNameSpace,function (err, OAWorkLists) {
    if (!err && OAWorkLists) {
      for (var i = 0; i < OAWorkLists.length; i++) {// 页面日期显示格式化
    	  OAWorkLists[i].createTime = new moment(OAWorkLists[i].createTime).format('YYYY-MM-DD HH:mm:ss');
      }

    } else
    	OAWorkLists = [];

     //console.log("query OAWorkLists:%s",JSON.stringify(OAWorkLists));
    res.render('./todo/showOAWorkList', {
      title : 'showOAWorkList',
      user : User.getSessionUser(req),
      result : merge(req.body, {
    	  OAWorkLists : OAWorkLists
      })
    });
  });
}
