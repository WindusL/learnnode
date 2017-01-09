/**
 * 面向对象程序设计学习
 */

//原始对象声明
var person1 = new Object();
person1.name = '张三';
console.log(person1.name);

//对象字面量
var person2 = {
    name: '张三'
};
console.log(person2.name);

//属性类型－数据属性 configurable|enumerable|value|writable
Object.defineProperty(person1, 'name', {
    writable: false //不可写入
});
person1.name = '李四';
person2.name = '李四';
console.log(person1.name);
console.log(person2.name);

/*注意　一旦设置属性不可配置后，再次设置除writable以外任何属性都不启作用*/
Object.defineProperty(person2, 'name', {
    configurable: false　//不可配置
});
delete person1.name;
delete person2.name;
console.log(person1.name);
console.log(person2.name);

//属性类型－访问器属性 configurable|enumerable|get|set
var book = {
    _year: 2016,
    edition: 1
};
console.log('\n\n');
Object.defineProperty(book, 'year', {
    get: function () {
        return this._year;
    },
    set: function (newValue) {
        if (newValue > this._year) {
            this.edition += newValue - this._year;
            this._year = newValue;
        }
    }
});
book.year = 2017;
console.log(book.edition);

//定义属性get|set非标准方法
book.__defineGetter__('year', function () {
    return this._year + 1;
});
book.__defineSetter__('year', function (newValue) {
    if (newValue > this._year) {
        this.edition += newValue - this._year;
        this._year = newValue;
    }
});

//读取属性的特性
var bookDescribe = Object.getOwnPropertyDescriptor(book, '_year');
console.log(bookDescribe.writable);

/*
 *对象创建模式
 */

//工厂模式（缺点：不知道创建对象的类型）
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        console.log(this.name);
    }
    return o;
}
var person3 = createPerson('张三', 20, '工程师');
var person4 = createPerson('李四', 19, '程序猿');

//构造函数模式(注意：函数名首字母大写。缺点：重复创建同样任务实例　如sayName函数)
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        console.log(this.name);
    }
}
var person5 = new Person('张三', 20, '工程师');
var person6 = new Person('李四', 19, '程序猿');

console.log('\n\n');
console.log(person5.constructor == Person);
console.log(person6.constructor == Person);
console.log(person5 instanceof Object);
console.log(person5 instanceof Person);

//构造函数改良版(缺点：定义过多全局函数，没有封装性)
function People(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}

function sayName() {
    console.log(this.name);
}

//原型模式
function PrototypeObj() {
}
PrototypeObj.prototype.name = '张三';
PrototypeObj.prototype.age = 20;
PrototypeObj.prototype.job = '工程师';
PrototypeObj.prototype.sayName = function () {
    console.log(this.name);
};

var prototypeObj1 = new PrototypeObj();
var prototypeObj2 = new PrototypeObj();

console.log("\n");
console.log(PrototypeObj.prototype.isPrototypeOf(prototypeObj1)); //测试是否为PrototypeObj原型
console.log(PrototypeObj.prototype.isPrototypeOf(prototypeObj2));
//或者
console.log(Object.getPrototypeOf(prototypeObj1) == PrototypeObj.prototype);
console.log(Object.getPrototypeOf(prototypeObj2) == PrototypeObj.prototype);

//判断实例中是否存在属性
prototypeObj2.name = '李四';
console.log("\n");
console.log(prototypeObj1.hasOwnProperty("name"));
console.log(prototypeObj2.hasOwnProperty("name"));

//in 操作符（单独使用时对象能访问到返回true/for-in）
console.log("\n");
console.log("name属性在原型：");
console.log(prototypeObj1.hasOwnProperty("name"));
console.log("name" in prototypeObj1);
console.log("name属性在实例：");
console.log(prototypeObj2.hasOwnProperty("name"));
console.log("name" in prototypeObj2);

console.log("对象上所有可枚举的实例属性：");
console.log(Object.keys(PrototypeObj.prototype));
console.log("对象上所有实例属性（包括不可枚举属性）：");
console.log(Object.getOwnPropertyNames(PrototypeObj.prototype));

//字面量重写原型对象(constructor属性被重写，不再指向PrototypeObj函数，而是指向Object构造函数)
PrototypeObj.prototype = {
    sex: 'male'
};

var prototypeObj3 = new PrototypeObj();
console.log(prototypeObj3 instanceof Object);
console.log(prototypeObj3 instanceof PrototypeObj);
console.log(prototypeObj3.constructor == Object);
console.log(prototypeObj3.constructor == PrototypeObj);

//字面量手动设置constructor 方法一：（注意：constructor特性[[Enumerable]]被设置为true。原生的constructor是不可枚举的）
PrototypeObj.prototype = {
    constructor: PrototypeObj,
    sex: 'male'
};
var prototypeObj4 = new PrototypeObj();
console.log(prototypeObj4 instanceof Object);
console.log(prototypeObj4 instanceof PrototypeObj);
console.log(prototypeObj4.constructor == Object);
console.log(prototypeObj4.constructor == PrototypeObj);

//字面量手动设置constructor　方法二： (注意：保留constructor默认特性)
Object.defineProperty(PrototypeObj.prototype, 'constructor', {
    enumerable: false,
    value: PrototypeObj
});
//注意：重写原型对象切断了现有原型与任何之前已经存在的对象实例之间的联系;它们引用的仍然是最初的原型

//原型对象的缺点：1、默认情况取得相同的属性值2、最大问题是由于其共享的本性所导致，引用类型一处被修改，其它地方也被修改。如下：
function PrototypeFlaw() {
}
PrototypeFlaw.prototype = {
    constructor: PrototypeFlaw,
    friends: ['Shellby', 'Court']
};
var prototypeFlaw1 = new PrototypeFlaw();
var prototypeFlaw2 = new PrototypeFlaw();
prototypeFlaw1.friends.push("Van");

console.log(prototypeFlaw1.friends);
console.log(prototypeFlaw2.friends);
console.log(prototypeFlaw1.friends === prototypeFlaw2.friends);

//组合使用构造函数和原型模式(目前ECMAScript中使用最广泛、认同度最高的一种创建自定义类型方法)
function ConstructorCombinationPrototype(name) {
    this.name = name;
    this.friends = ['Shellby', 'Court'];
}

ConstructorCombinationPrototype.prototype = {
    constructor: ConstructorCombinationPrototype,
    sayName: function () {
        console.log(this.name);
    }
};

//动态原型模式（将原型挪到构造函数中，动态判断方法是否存在，不存在创建）
function ConstructorCombinationPrototype2(name) {
    this.name = name;
    this.friends = ['Shellby', 'Court'];

    if (typeof ConstructorCombinationPrototype2.sayName() != "function") {
        ConstructorCombinationPrototype2.prototype.sayName = function () {
            console.log(this.name);
        }
    }
}
//注意：使用动态原型模式时，不能使用对象字面量重写原型，如果已经创建了实例的情况下，重写原型就会切断现在实例与新原型之间的联系。


//寄生构造函数模式（通常在前几种模式都不适用的情况下使用）
function SpecialArray() {
    var values = new Array();
    values.push.apply(values, arguments);
    values.toPipedString = function () {
        return this.join("|");
    }

    return values;
}

var colors = new SpecialArray("red", "blue", "green");
console.log("\n");
console.log(colors.toPipedString());
/*
 注意：寄生构造函数模式返回的对象与构造函数或者与构造函数的原型属性之间没有关系;也就是说，
 构造函数返回的对象与在构造函数外部创建的对象没有什么不同。
 因此，不能依赖instanceof操作符来确定对象类型。
 由于存在上述问题，建议在可以使用其他模式的情况下，不要使用这种模式。
 */


//稳妥构造函数模式（除了调用sayName方法以外，没有其它方式访问数据成员）
function SafeModel(name) {
    var o = new Object();
    o.sayName = function () {
        console.log(name);
    }
    return o;
}

var sm = SafeModel('Nicholas');
console.log("\n");
sm.sayName();
/*
 * 与寄生构造函数模式类似，使用稳妥构造函数模式创建的对象与构造函数之间没有什么关系，
 * 因此instansof操作符对这种对象也没有什么意义。
 */























