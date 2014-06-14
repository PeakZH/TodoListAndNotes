var User = require('./models/user');
var moment = require("moment");
var merge = require('merge');
var ToDoList = require('./models/cal/ToDoList');
var settings = require('./settings')[process.env.NODE_ENV || 'dev'];
//
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// configure app
app.use(bodyParser());

var port     = process.env.PORT || 8001; // set our port

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);


router.route('/ToDoList')
    .post(function(req,res){
	console.log("/ToDoList,params:%s", JSON.stringify(req.body));
	ToDoList.add(req.body.namespace,req.body.content,function(){
	    res.json({message:"add todolist success!"});
      });
    })
    .get(function(req,res){//默认的命名空间
	listToDoList(settings.defaultNameSpace,null,req, res);
    });

router.route('/ToDoList/:_id')
    .get(function(req, res) {
	if(isNaN(req.params._id))//如果不是数字，则当做命名空间变量看待
	    listToDoList(req.params._id,null,req, res);
	else{
	    console.log("/ToDoList id is %d",req.params._id);
	    listToDoList(null,req.params._id,req, res);
	}
    })

    // update 状态或者内容
    .put(function(req, res) {
	console.log("/ToDoList params is %s body is %s",JSON.stringify(req.params),JSON.stringify(req.body));
	if(isNaN(req.params._id))//如果不是数字，则当做命名空间变量看待
	    ;//do nothing
	if (req.body.content) {
	    ToDoList.updateContent(req.params._id,req.body.content);
	}else
	    ToDoList.updateStatus(req.params._id);

	res.json({ message: "update status ok" });
    })
    .delete(function(req, res) {
	if(req.params._id)
	   res.json({ message: "don't support delete,this time" });
    });

function listToDoList (namespace,id,req, res) {
    ToDoList.query(namespace,id,function (err, todolists) {
	if (!err && todolists) {
	    for (var i = 0; i < todolists.length; i++) {// 页面日期显示格式化
		todolists[i].createTime = new moment(todolists[i].createTime).format('YYYY-MM-DD HH:mm:ss');
		todolists[i].modifyTime = new moment(todolists[i].modifyTime).format('YYYY-MM-DD HH:mm:ss');
	    }
	} else
	todolists = [];

    res.json({result:todolists});
    // console.log("query todolists:%s",JSON.stringify(todolists));

  });
}
