/**
 * 对象继承
 */
/*
 *原型链：第一个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针
 * 让原型对象等于另一个类型的实例，此时的原型中也包含一个指向另一个原型的指针，相应地，
 * 另一个原型中也包含着一个指向另一个构造函数的指针，如此层层递进，就构成了实例与原型的链条。这就是所谓的原型链
 * （
 * 缺点：1、引用类型共享问题［通过原型实现继承时，原型实际上会变成另一个类型的实例。
 *                          于是，原先的实例属性也就顺理成章地变成了现在的原型属性了。］
 *      2、创建子类型的实例时，不能向超类型的构造函数中传递参数［没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数］。
 *  ）
 */
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function () {
    return this.property;
}

function SubType() {
    this.subProperty = false;
}

//继承SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
    return this.subProperty;
};

var instance = new SubType();
console.log(instance.getSuperValue());
console.log(instance instanceof Object);
console.log(instance instanceof SuperType);
console.log(instance instanceof SubType);
// 或者
console.log(Object.prototype.isPrototypeOf(instance));
console.log(SuperType.prototype.isPrototypeOf(instance));
console.log(SubType.prototype.isPrototypeOf(instance));
// 定义方法需要在实例替换原型后，否则会被覆盖

//通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样会重写原型链，如：
SubType.prototype = {
    getSubValue: function () {
        return this.subProperty;
    }
};

var instance2 = new SubType();
// console.log(instance2.getSuperValue());//error!
//由于现在原型包含的是一个Object实例，而非SuperType的实例，因此我们设想中的原型链已经被切断，SubType和SuperType之间已经没有关系了。


/*
 * 借用构造函数
 * 缺点：方法都在构造函数中定义，因此函数利用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型不可见，
 * 结果所有类型都只能使用构造函数模式。由于这些问题，借用构造函数的动手术也是很少单独使用。
 */
function SuperType2() {
    this.color = ['red', 'blue', 'green'];
}

function SubType2() {
    // 继承SuperType(调用SuperType构造函数)
    SuperType2.call(this);
}

var instance3 = new SubType2();
instance3.color.push('black');
console.log(instance3.color); // red blue green black

var instance4 = new SubType2();
console.log(instance4.color); // red blue green

//优势：相对于原型链，借用构造函数可以在子类中向超类型构造函数传递参数
function SuperType3(name) {
    this.name = name;
}

function SubType3(name, age) {
    SuperType3.call(this, name);
    this.age = age;
}

var instance5 = new SubType3('Nicholas', 20);
console.log(instance5.name);
console.log(instance5.age);
var instance6 = new SubType3('Jack', 18);
console.log(instance6.name);
console.log(instance6.age);


/*
 * 组合继承
 */
