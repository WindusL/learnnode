/**
 * 用户表模型
 */
const db = require('../../db-sequelize');

module.exports = db.defineModel('User', {
    name: db.STRING(11)
});