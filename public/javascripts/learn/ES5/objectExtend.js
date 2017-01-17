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
 * 结果所有类型都只能使用构造函数模式。由于这些问题，借用构造函数的技术也是很少单独使用。
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
 * 伪经典继承，将原型链和借用构造函数的技术组合到一块。
 * （使用原型链实现对原型属性和方法的继承，通过借用构造函数来实现对实例属性的继承。
 * 组合继承避免了原型链和借用构造函数的缺陷，整合了空位的优点，成为JavaScript中最常用的继承模式。
 * 而且，instanceof和isPrototypeOf也能够用于识别基于组合继承创建的对象
 */
function Fruit(name) {
    this.name = name;
    this.fav = ['good', 'beauty'];
}

Fruit.prototype.sayName = function () {
    console.log(this.name);
}

function Apple(name, color) {
    Fruit.call(this, name);
    this.color = color;
}

Apple.prototype = new Fruit();

Apple.prototype.sayColor = function () {
    console.log(this.color);
}

var fru1 = new Apple('红苹果', 'red');
fru1.sayName();
fru1.sayColor();
fru1.fav.push('dush');
console.log(fru1.fav);

var fru2 = new Apple('绿苹果', 'green');
fru2.sayName();
fru2.sayColor();
console.log(fru2.fav);


/*
 *原型式继承(引用类型值的属性共享)
 */
function object(o) {
    function F() {

    }

    F.prototype = o;
    return new F();
}

var person = {
    name: 'Nicholas',
    friends: ['Shelby', 'Court', 'Van']
};

var anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');

var yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Barble');

console.log(person.friends);
console.log(anotherPerson.friends);
console.log(yetAnotherPerson.friends);


/*
 *寄生式继承
 * 与原型式继承紧密相关的一种思路
 * 缺点：为对象添加函数，会由于不能做到函数复用而降低效率;这一点与构造函数模式类似。
 */
function createAnother(original) {
    var clone = object(original);
    clone.sayHi = function () {
        console.log("hi");
    }
    return clone;
}

var anotherPerson = {
    name: 'Nicholas',
    friends: ['Shelby', 'Court', 'Van']
};
var anotherPerson = createAnother(anotherPerson);
anotherPerson.sayHi();


/*
 *寄生组合式继承
 */