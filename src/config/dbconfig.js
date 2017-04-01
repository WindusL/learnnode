/**
 * 数据库配置文件
 */
var sequelizeConfig = {
    database: 'test',
    username: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 1000
    }
};

var mysqlConfig = {
    database: 'test',
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    connectionLimit:2,
    queryTimeout:30000
};

module.exports = {
    'mysqlConfig': mysqlConfig,
    'sequelizeConfig': sequelizeConfig
};