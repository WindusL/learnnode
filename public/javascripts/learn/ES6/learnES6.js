function SuperType(name) {
    this.name = name;
    this.color = ['red', 'white', 'black'];
}

SuperType.prototype.sayName = function () {
    console.log(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}

SubType.prototype = new SuperType();

SuperType.prototype.sayAge = function () {
    console.log(this.age);
}

var st1 = new SubType('lhz', 27);
st1.sayName();
st1.sayAge();
st1.color.push("blue");
console.log(st1.color);

var st2 = new SubType('szf', 25);
st2.sayName();
st2.sayAge();
console.log(st2.color);
