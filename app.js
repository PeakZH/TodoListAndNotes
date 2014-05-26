
process.env.NODE_ENV = process.env.NODE_ENV || "dev";
var express = require('express.io');

var http = require('http');
var path = require('path');
var moment = require("moment");
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var settings = require('./settings')[process.env.NODE_ENV];
var User = require('./models/user');
var ToDoList = require('./models/cal/ToDoList');
//var routes = require('./routes');

var app = express();
app.http().io();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser({
  keepExtensions : true,
  uploadDir : './public/upload'
}));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
if (settings.enableSession) {
	console.log('settings.enableSession %s,%s,%s',
			settings.enableSession,settings.cookieSecret,settings.mongodb.db);
  app.use(express.session({
    secret : settings.cookieSecret,
    key : settings.mongodb.db,// cookie name
    cookie : {
      maxAge : 1000*60*30
    },// 30 minutes
    store : new MongoStore(settings.mongodb)
  }));
}
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
}

app.use(app.router);
app.use('/', require('./routes/index-r').middleware);
app.use('/user', require('./routes/user-r').middleware);
app.use('/todolist', require('./routes/ToDoList-r').middleware);
app.use('/oa-work', require('./routes/OAWorkList-r').middleware);
app.use('/notes', require('./routes/NoteList-r').middleware);
//app.use('/cal', require('./routes/cal').middleware);

process.on('uncaughtException', function (err) {
  console.log('uncaughtException', err);
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  console.log("env : " + process.env.NODE_ENV);
  
});
