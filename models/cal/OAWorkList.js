var pool = require('../mysql');

function OAWorkList (id, content, status, createTime) {
  this.id = id;
  this.content = content;
  this.status = status;
  this.createTime = createTime;
}

module.exports = OAWorkList;

OAWorkList.query = function (namespace,callback) {
  // 打开数据库
  pool
      .getConnection(function (err, conn) {
        if (err) {
          console.error(err);
          conn.release();
          return callback(err);
        }
        var sql = "select id,                \
        	CONTENT        as content,       \
        	status                     ,     \
        	CREATE_TIME    as createTime     \
        	from TBL_RF_OA_LIST              \
        	where status!='success' ";
        var sqlFoot = " order by CREATE_TIME";
	
	if(namespace)
	  sql = sql + " and namespace =" + "'"+namespace + "' ";
	
	sql = sql + sqlFoot;

        conn.query(sql, function (err, rows) {
          if (err || !rows || rows.length < 1) {
            console.error(err);
            conn.release();
            callback(err, null);
          } else {
            conn.release();
             //console.log("rows is:%s",JSON.stringify(rows));
            callback(null, rows);
          }
        });
      });
};

OAWorkList.add = function (content, callback) {
  if (!content) {
    console.log("OAWorkList paramters is null");
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
        var sql = "INSERT INTO TBL_RF_OA_LIST(content,status,create_time,namespace) VALUES(?,'init',?,'yeepay.com')";
        conn.query(sql, [content,new Date()],
            function (err, result) {
              if (err) {
                conn.release();
                console.error(err);
                callback(err, null);
              } else {
            	 // console.log("result is:%s",JSON.stringify(result));
                
                  conn.release();
                  callback(err, result);
              }
            });
      });
};

OAWorkList.updateStatus = function (id, callback) {
  if (!id) {
    callback(null, null);
  }
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error(err);
      conn.release();
      return callback(err);
    }
    var sql = "update TBL_RF_OA_LIST set status= 'success' WHERE status='init' and ID = ?";
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
OAWorkList.updateContent = function (id,content,callback) {
	if (!id) {
		callback(null, null);
	}
	pool.getConnection(function (err, conn) {
		if (err) {
			console.error(err);
			conn.release();
			return callback(err);
		}
		var sql = "update TBL_RF_OA_LIST set CONTENT= ? WHERE status='init' and ID = ?";
		conn.query(sql, [content,id], function (err, result) {
			if (err){console.error(err);}
				
			conn.release();
			if (callback) {
				callback(err, result);
			}
		});
	});
};
