const mysql = require('mysql');
const dbconfig = require('./src/config/dbconfig').mysqlConfig;

const pool = mysql.createPool(dbconfig);

pool.on('acquire', function (connection) {
    console.log('%d 数据连接成功', connection.threadId);
});

pool.on('connection', function (connection) {
    console.log('%d 数据库连接', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('%d 释放数据库连接', connection.threadId);
});

/**
 * 自定义查询参数格式
 * @param {*数据库连接} connection 
 * connection.query("UPDATE posts SET title = :title", { title: "Hello MySQL" });
 */
function setQueryFormat(connection) {
    connection.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };
}

/**
 * 获取连接池连接
 */
var getPoolConnection = () => {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) reject(err);
            resolve(connection);
        });
    });
};

/**
 * 开启数据库事务
 * @param {*数据库连接} connection 
 */
var getConnectionTransaction = (connection) => {
    return new Promise(function (resolve, reject) {
        console.log('%d 开启事务', connection.threadId);
        connection.beginTransaction(function (err) {
            if (err) reject(err);
            resolve();
        });
    });
};

/**
 * 操作数据库
 * @param {*数据库连接} connection 
 * @param {*数据库query选项 sql/values} option 
 */
var executeQuery = (connection, option) => {
    return new Promise(function (resolve, reject) {
        var query = connection.query(option, function (err, results, fields) {
            if (err) reject(err);
            resolve(results);
        });

        // 监听query异常事件
        query
            .on('error', function (err) {
                console.log('数据库操作异常：' + err);
            });
    });
};

module.exports = {
    /**
     * 用于查询、删除方法
     * 无事务
     * @param{*基本键sql、values} option
     */
    executeQuery: async (option) => {
        try {
            var opt = option || {};
            opt.timeout = dbconfig.queryTimeout;

            // 获取数据库连接
            var connection = await getPoolConnection();
            // 自定义参数属性
            setQueryFormat(connection);
            // 执行sql
            var queryResult = await executeQuery.call(this, connection, opt);

            connection.release();
            return queryResult;
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 用于新增、更新方法(***方法待完善***)
     * 有事务控制
     */
    executeQueryTransaction: async (callback) => {
        try {
            // 获取数据库连接
            var connection = await getPoolConnection();
            // 自定义参数属性
            setQueryFormat(connection);
            // 开启事务
            await getConnectionTransaction(connection);
            // 执行sql
            await callback(executeQuery.bind(this, connection), connection);
            // 提交事务
            connection.commit(function (err) {
                if (err) {
                    return connection.rollback(function () {
                        throw err;
                    });
                }
                console.log('%d 事务提交成功!', connection.threadId);
                // 释放数据库连接
                connection.release();
            });
        } catch (err) {
            console.log(err)
        }
    }
};
