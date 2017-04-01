/**
 * 测试
 */
var fs = require('fs');

var readFile = (fileName) => {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
};

var asyncReadFile = async function () {
    var f1 = await readFile('/Users/Windus/shells/make_project.sh');
    console.log(f1.toString());
};

asyncReadFile();

