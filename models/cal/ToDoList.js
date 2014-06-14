var pool = require('../mysql');

function ToDoList (id, content, status, modifyTime, createTime) {
  this.id = id;
  this.content = content;
  this.status = status;
  this.modifyTime = modifyTime;
  this.createTime = createTime;
}

module.exports = ToDoList;

ToDoList.query = function (namespace,id,callback) {
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
          status                     ,   \
          MODIFY_TIME    as modifyTime,  \
          CREATE_TIME    as createTime   \
        from TBL_RF_TODO_LIST            \
        where status='init'";
        
	var sqlfoot = " order by CREATE_TIME";
	
	if(namespace) sql = sql + " and namespace='"+namespace + "' ";
	if(id) sql =sql  + " and id="+id + " ";
        
	sql = sql + sqlfoot;
         console.log("sql is:%s",sql);
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

ToDoList.add = function (namespace,content, callback) {
  if (!content) {
    console.log("ToDoList paramters is null");
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
        var sql = "INSERT INTO TBL_RF_TODO_LIST(content,status,create_time,namespace) VALUES(?,'init',?,?)";
        conn.query(sql, [content,new Date(),namespace],
            function (err, result) {
              if (err) {
                conn.release();
                console.error(err);
                callback(err, null);
              } else {
            	 // console.log("result is:%s",JSON.stringify(result));
                
                  conn.release();
                  callback(err, ToDoList);
              }
            });
      });
};

ToDoList.updateStatus = function (id, callback) {
  if (!id) {
    callback(null, null);
  }
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error(err);
      conn.release();
      return callback(err);
    }
    var sql = "update TBL_RF_TODO_LIST set status= 'success' WHERE status='init' and ID = ?";
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
ToDoList.updateContent = function (id,content,callback) {
	  if (!id) {
	    callback(null, null);
	  }
	  pool.getConnection(function (err, conn) {
	    if (err) {
	      console.error(err);
	      conn.release();
	      return callback(err);
	    }
	    var sql = "update TBL_RF_TODO_LIST set CONTENT= ? WHERE status='init' and ID = ?";
	    conn.query(sql, [content,id], function (err, result) {
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
