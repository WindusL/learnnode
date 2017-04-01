const Koa = require('koa2');
const fs = require('fs');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const rest = require('./rest');
const pool = require('./db-mysql');

const app = new Koa();
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// static file support:
// let staticFiles = require('./static-files');
// app.use(staticFiles('/static/', __dirname + '/static'));

// parse request body:
app.use(bodyParser());

// bind .rest() for ctx:
app.use(rest.restify());

// add controllers:
app.use(controller());







// var query = {
//     sql: 'select * from user where id = :id',
//     values: {
//         id: 3
//     }
// };
// pool.executeQuery(query).then(function (result) {
//     console.log(result);
// });

pool.executeQueryTransaction(async (executeQuery, connection) => {
    var i1 = {
        sql: 'insert into user(name,create_at,update_at) values(:name,now(),now())',
        values: {
            name: '赵十'
        }
    }
    var i2 = {
        sql: 'insert into user(name,create_at,update_at) values(:name,now(),now())',
        values: {
            name: '赵十一'
        }
    }
    var q1 = {
        sql: 'select * from user'
    };

    var r1 = await executeQuery(q1);
    console.log('前查询' + r1);
    var r3 = await executeQuery(i1);
    var r4 = await executeQuery(i2);
    console.log('输出')
    console.log(r3);
    var r2 = await executeQuery(q1);
    console.log('后查询' + r2);
});













app.listen(3000, function () {
    console.log('app started at port 3000...');
});