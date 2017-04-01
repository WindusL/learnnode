/**
 * model自动扫描
 */
const fs = require('fs');
const db = require('./db-sequelize');

var files = fs.readdirSync(`${__dirname}/src/model`);

let js_file = files.filter((f) => {
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_file) {
    console.log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require(`${__dirname}/src/model/${f}`);
}

module.exports.sync = () => {
    db.sync();
}