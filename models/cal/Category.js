var pool = require('../mysql');

function Category (namespace, category) {
  this.namespace = namespace;
  this.category = category;
}

module.exports = Category;

Category.query = function (callback) {
  // 打开数据库
  pool
      .getConnection(function (err, conn) {
        if (err) {
          console.error(err);
          conn.release();
          return callback(err);
        }
        var sql = "select n.NAMESPACE as namespace, \
        			c.CATEGORY  as category         \
        		from TBL_RF_NAMESPACE  n            \
        		left join TBL_RF_CATEGORY c         \
        			on n.id = c.namespace_id";
        conn.query(sql, function (err, rows) {
          if (err || !rows || rows.length < 1) {
            console.error(err);
            conn.release();
            callback(err, null);
          } else {
            conn.release();
            // console.log("rows is:%s",JSON.stringify(rows));
            callback(null, rows);
          }
        });
      });
};
