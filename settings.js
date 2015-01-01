module.exports = {
  "dev" : {
    cookieSecret : 'localToDoList',
    enableSession : false,
    defaultNameSpace : 'yeepay.com',
    defaultCategory : 'daily notes',
    defaultOACompany: 'yeepay.com',
    defaultPersonToDoNameSpace: 'person',
    NotesContentLengthLimit:500,
    mongodb : {
      db : 'yeenode',
      host : 'localhost',
      port : 27017,
      collection: "mysessions",
      clear_interval: 3600,
      auto_reconnect: true
    },
   mysqldb : {
      host : '127.0.0.1',
      user : 'root',
      password : 'root',
      database : 'node',
      port : 3306
    }
  }
};
