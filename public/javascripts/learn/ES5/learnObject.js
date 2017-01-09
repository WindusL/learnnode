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

//构造函数模式(注意：函数名首字母大写)
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









