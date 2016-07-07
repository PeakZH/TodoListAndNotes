var pool = require('../mysql');

function NoteList (id, title,content,date,modifyTime, createTime,topflag) {
  this.id = id;
  this.content = content;
  this.title = title;
  this.date = date;
  this.modifyTime = modifyTime;
  this.createTime = createTime;
  this.topflag = topflag;
}

module.exports = NoteList;

NoteList.queryByMonth = function (callback) {
	  // 打开数据库
	  pool
	      .getConnection(function (err, conn) {
	        if (err) {
	          console.error(err);
	          conn.release();
	          return callback(err);
	        }
	        var sql = "select DATE_FORMAT(date,'%Y-%m')        as month,\
		                  count(DATE_FORMAT(date,'%Y-%m')) as count \
		           from TBL_RF_NOTE_LIST                            \
		           group by month ";
	        
	        //console.log("sql is:%s id is:%d",JSON.stringify(sql),id);
	        conn.query(sql,function (err, rows) {
	          if (err || !rows || rows.length < 1) {
	            console.error(err);
	            conn.release();
	            callback(err, null);
	          } else {
	            conn.release();
	           //  console.log("rows is:%s",JSON.stringify(rows));
	            callback(null, rows);
	          }
	        });
	      });
	};


NoteList.queryNameSpace = function (callback) {
	  // 打开数据库
	  pool
	      .getConnection(function (err, conn) {
	        if (err) {
	          console.error(err);
	          conn.release();
	          return callback(err);
	        }
	        var sql = "select distinct namespace from TBL_RF_NOTE_LIST ";
	        
	        //console.log("sql is:%s id is:%d",JSON.stringify(sql),id);
	        conn.query(sql,function (err, rows) {
	          if (err || !rows || rows.length < 1) {
	            console.error(err);
	            conn.release();
	            callback(err, null);
	          } else {
	            conn.release();
	           //  console.log("rows is:%s",JSON.stringify(rows));
	            callback(null, rows);
	          }
	        });
	      });
	};

NoteList.queryCategory = function (callback) {
	  // 打开数据库
	  pool
	      .getConnection(function (err, conn) {
	        if (err) {
	          console.error(err);
	          conn.release();
	          return callback(err);
	        }
		var sql = "select  namespace, category,count(category) as count \
				from TBL_RF_NOTE_LIST 	where namespace in(             \
					select     distinct namespace from TBL_RF_NOTE_LIST )\
				group by category,namespace order by namespace";
	        
	        //console.log("sql is:%s",JSON.stringify(sql));
	        conn.query(sql,function (err, rows) {
	          if (err || !rows || rows.length < 1) {
	            console.error(err);
	            conn.release();
	            callback(err, null);
	          } else {
	            conn.release();
	            console.log("rows is:%s",JSON.stringify(rows));
	            callback(null, rows);
	          }
	        });
	      });
	};
	
NoteList.query = function (id,title,paramKeyWords,nameSpace,category,dateStart,dateEnd,callback) {
  // 打开数据库
  pool
      .getConnection(function (err, conn) {
        if (err) {
          console.error(err);
          conn.release();
          return callback(err);
        }
        var sql = "select id,            \
          CONTENT        as content,     \
          title                     ,    \
          namespace,category,topflag,    \
          date                      ,    \
          MODIFY_TIME    as modifyTime,  \
          CREATE_TIME    as createTime   \
        from TBL_RF_NOTE_LIST            \
        where 1=1 ";
        
        var sqlfoot = " order by TOPFLAG desc,date desc limit 10";
        if(paramKeyWords){
        	var sqlextra = '';
        	var keys = paramKeyWords.split(',');
        	for(var i=0;i<keys.length;i++){
        		sqlextra = sqlextra + " and upper(CONTENT) like upper('%" + keys[i]+ "%') ";
        	}
        	sql = sql +sqlextra;
        //	console.log("sql is:%s ",sql);
        }
        if(title)
          sql = sql + " and title LIKE " + "'%"+title+"%'";

        if(id)
        	sql = sql + " and id ="+id;
        
        if(nameSpace)
        	sql = sql + " and namespace like " + "'%"+nameSpace+"%'";
        
	if(dateStart)
        	sql = sql + " and date >= " + "'"+dateStart+"'";
        if(dateEnd)
        	sql = sql + " and date <= " + "'"+dateEnd+"'";

        if(category)
        	sql = sql + " and category like " + "'%"+category+"%'";
        
        if(paramKeyWords || title || nameSpace || dateStart || category){
          sql = sql + " order by TOPFLAG desc,date desc ";
        }else{
          sql = sql + sqlfoot;
        }
        
        
	//console.log("sql is:%s id is:%d",JSON.stringify(sql),id);
        conn.query(sql, function (err, rows) {
          if (err || !rows || rows.length < 1) {
            console.error(err);
            conn.release();
            callback(err, null);
          } else {
            conn.release();
           //  console.log("rows is:%s",JSON.stringify(rows));
            callback(null, rows);
          }
        });
      });
};

NoteList.add = function (date,namespace,category,title,content,topflag,callback) {
  if (!content) {
    console.log("NoteList paramters is null");
    callback(null, null);
    return;
  }
  // insert
  pool.getConnection(function (err, conn) {
        if (err) {
          console.error(err);
          conn.release();
          return callback(err);
        }
        var sql = "INSERT INTO TBL_RF_NOTE_LIST(content,title,create_time,namespace,category,date,topflag) VALUES(?,?,?,?,?,?,?)";
        conn.query(sql, [content,title,new Date(),namespace,category,date,topflag],
            function (err, result) {
              if (err) {
                conn.release();
                console.error(err);
                callback(err, null);
              } else {
            	 // console.log("result is:%s",JSON.stringify(result));
                
                  conn.release();
                  callback(err, NoteList);
              }
            });
      });
};

NoteList.updateStatus = function (id, callback) {
  if (!id) {
    callback(null, null);
  }
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error(err);
      conn.release();
      return callback(err);
    }
    var sql = "update TBL_RF_NOTE_LIST set status= 'success' WHERE status='init' and ID = ?";
    conn.query(sql, [id], function (err, result) {
      if (err) {
        console.error(err);
      } 
      conn.release();
      if (callback) {
        callback(err, result);
      }
    });
  });
};
NoteList.updateContent = function (id,title,namespace,category,topflag,content,callback) {
    if (!id) {
	callback(null, null);
    }
    //console.log("NoteList.updateContent,params:%d %s %s %s %d %s", id,title,namespace,category,topflag,content);
    pool.getConnection(function (err, conn) {
	if (err) {
	    console.error(err);
	    conn.release();
	    return callback(err);
	}
	var sql = "update TBL_RF_NOTE_LIST \
    		set CONTENT= ? ,           \
    		 title = ?     ,       	   \
    		 namespace = ? ,           \
    		 category = ?  ,           \
    		 topflag = ?               \
	    WHERE ID = ?";
	conn.query(sql, [content,title,namespace,category,topflag,id], function (err, result) {
	    if (err) {
		console.error(err);
	    } 
	     // console.log("NoteList.updateContent,params:%s", JSON.stringify(result));
	     conn.release();
	     if (callback) {
		 callback(err, result);
	     }
	});
    });
};
