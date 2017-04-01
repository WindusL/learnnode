>* 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做Tunk函数。  
>* JavaScript语言是传值调用，它的Thunk函数含义有所不同。在JavaScript语言中，Thunk函数替换的不是表达式，而是多参数函数，将其替换成单参数的版本，且只接受回调函数作为参数。
```
//正常版本的readFile（多参数)
fs.readFile(fileName,callback);

//Thunk版本的readFile(单参数)
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

var Thunk = function(fileName){
    retrun function(callback){
        return fs.readFile(fileName,callback);
    }
}
```
> Thunk函数转换器
```
//ES5版本
//第一步：接收要执行函数
var ThunkES5 = function(fn){
    return function(){
        //第二步：转换要执行函数参数
        var args = Array.prototype.slice.call(arguments);
        return function(callback){
            //第三步：接收回调函数并根据转换好的参数执行已接收的函数
            args.push(callback);
            fn.apply(this,args);
        };
    };
};

//ES6版本
var ThunkES6 = function(fn){
    return function(...args){
        return function(callback){
            fn.call(this,...args,callback);
        };
    };
};

//使用上面转换器
var readFileThunk = ThunkES6(fs.readFile);
readFileThunk(fileName)(callback);
```

> * Thunk函数与Generator函数结合自动流程管理  
*Thunk函数真正的能力，在于可以自动执行Generator函数*  
```
//thunkify函数
function thunkify(fn){
　//判断fn是否为为函数
  assert('function' == typeof fn, 'function required');

  //返回传入函数的Tunk函数
  return function(){
    //转换要Thunk函数的参数
    var args = new Array(arguments.length);
    var ctx = this;

    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    /*
    *返回回调函数（也就是Generator函数的value的返回值）
    */
    return function(done){
      var called;

      args.push(function(){
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};

//调用实例
var fs = require('fs');
var thunkify = require('thunkify');

var readFile = thunkify(fs.readFile);

var gen = function* () {
    var r1 = yield readFile('/Users/Windus/shells/make_project.sh');
    //返回值r1为generate函数调用next(val)方法的参数val值(即下面104行data值)
    console.log(r1.toString());

    var r2 = yield readFile('/Users/Windus/shells/make_project.sh');
    console.log(r2.toString());
};

function run(fn) {
    var gen = fn();
    function next(err, data) {
        var result = gen.next(data);
        if (result.done) return;
        //调用Generator函数value返回的函数，传入回调函数
        result.value(next);
    }

    next();
}

run(gen);
```
