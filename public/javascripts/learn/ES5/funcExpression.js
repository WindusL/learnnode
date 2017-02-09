/**
 * 函数表达式
 */

/*
 *函数创建方式
 * name属性最初由各个厂商自己实现的属性返回函数名，匿名函数返回空字符串
 * ES6正式将name属性纳入标准
 */
//函数声明(重要特性：函数声明提升)
sayHi(); //正确　代码执行前会先读取函数声明
function sayHi() {
    console.log("Hi!");
}

//函数表达式
// sayName(); //报错　sayName is not a function
var sayName = function () {
    console.log("my name ……!");
};
sayName(); //正确

//案例(因为函数声明提升，下面代码为无效语法，JavaScript会尝试修正错误，将其转换合理的状态)
var condition = true;
if (condition) {
    function sayAge() {
        console.log(20);
    }
} else {
    function sayAge() {
        console.log(18);
    }
}

//修改后实现 (正确执行)
var sayAgeExpression;
if (condition) {
    sayAgeExpression = function () {
        console.log(20);
    };
} else {
    sayAgeExpression = function () {
        console.log(18);
    };
}


/*
 *递归
 * 参考ES6尾调用优化
 */
// arguments.callee 指向一个正在执行函数的指针
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

var anotherFacotrial = factorial;
// factorial = null;　//设置为null下面调用出错，因为递归中必须调用factorial，而factorial为null
console.log(anotherFacotrial(4));

//－－－－改进
function factorialCall(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
}

var anotherFactorialCall = factorialCall;
factorialCall = null; //由于不再依赖函数名递归，所以设置为null后依然正确执行
console.log(anotherFactorialCall(4));


/*
 * 闭包
 * 由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。
 *　所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。
 * 闭包就是能够读取其他函数内部变量的函数
 */
function readClosure() {
    var n = 1000;

    function innerFunc() {
        console.log(n);
    }

    return innerFunc;
}

var rc = readClosure();
rc();

//闭包用途　两大用处　一个是可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。
function outterFunc() {
    var n = 999;

    nAdd = function () {
        n++;
    }

    function innerFunc() {
        console.log(n);
    }

    return innerFunc;
}

var of = outterFunc();
of();
nAdd();
of();
/*
 *上面代码中，of实际上就是闭包innerFunc函数。它一共运行了两次，第一次的值是999，第二次的值是1000。
 * 这证明了，函数outterFunc中的局部变量n一直保存在内存中，并没有在f1调用后被自动清除。
 *为什么会这样呢？原因就在于outterFunc是innerFunc的父函数，而innerFunc被赋给了一个全局变量，这导致innerFunc始终在内存中，而innerFunc的存在依赖于outterFunc，
 * 因此outterFunc也始终在内存中，不会在调用结束后，被垃圾回收机制（garbage collection）回收。
 *这段代码中另一个值得注意的地方，就是"nAdd=function(){n+=1}"这一行，首先在nAdd前面没有使用var关键字，
 * 因此nAdd是一个全局变量，而不是局部变量。其次，nAdd的值是一个匿名函数（anonymous function），
 * 而这个匿名函数本身也是一个闭包，所以nAdd相当于是一个setter，可以在函数外部对函数内部的局部变量进行操作。
 */



/*
 *块级作用域（ES5没有块级作用域，参考ES6块级作用域）
 */
function outputNumbers(count) {
    for (var i = 0; i < count; i++) {
        console.log(i);
    }
    console.log("外层：");
    console.log(i);
}
outputNumbers(5);

//ES5 模仿块级作用域
function outputNumbers2(count) {
    // IIFE写法　模仿块级作用域
    (function () {
        for (let j = 0; j < count; j++) {
            console.log(j);
        }
    })();
    console.log("外层：");
    // console.log(j);
}

outputNumbers2(5);

//ES6写法 let声明变量
function outputNumbers3(count) {
    for (let k = 0; k < count; k++) {
        console.log(k);
    }
    console.log("外层：");
    // console.log(k);
}
outputNumbers3(5);



