/**
 * 初始化sequelize
 */
const Sequelize = require('sequelize');
const dbconfig = require('./src/config/dbconfig').sequelizeConfig;//数据库配置文件
const ID_TYPE = Sequelize.INTEGER(11);// 主键类型
const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

console.log('ini sequelize...');

var sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, {
    host: dbconfig.host,
    dialect: dbconfig.dialect,
    pool: {
        max: dbconfig.pool.max,
        min: dbconfig.pool.min,
        idle: dbconfig.pool.idle
    }
});

function defineModel(name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }

    // 主键ID
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };

    // 创建时间
    attrs.createAt = {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'create_at'
    };

    // 更新时间
    attrs.updateAt = {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'update_at'
    };

    return sequelize.define(name, attrs, {
        // 不允许调整表名 ; 
        // 默认地, sequelize 会自动转换所有传递的模型名字(define 的第一个参数)
        // 为复数
        // 如果不想这样,设置为 true
        freezeTableName: true,
        // 定义表名
        tablename: name,
        // 不增加 TIMESTAMP 属性
        timestamps: false,
        // 不要使用驼峰式语法,用下划线代替
        // so updatedAt will be updated_at
        underscoredAll: true,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    obj.createAt = now;
                    obj.updateAt = now;
                } else {
                    obj.updateAt = now;
                }
            }
        }
    });
}

var exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            // 强制同步所有数据库的模型
            sequelize.sync({ force: true });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

module.exports = exp;