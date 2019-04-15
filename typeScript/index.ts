{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
};{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
}
{
    var message:string = "Hello World" 
console.log(message)
};
{
    var message:string = "Hello World" 
console.log(message);
};
{
    var message:string = "Hello World" 
console.log(message);
};
    // 函数定义
function greet():string { // 返回一个字符串
    return "Hello World111" 
} ;
 
function caller(){ 
    var msg = greet() // 调用 greet() 函数 
    console.log(msg) 
} 
 
// 调用函数
caller()

function employee(id:number,name:string) { 
    this.id = id 
    this.name = name 
} 
 
var emp = new employee(123,"admin") 
employee.prototype.email = "admin@runoob.com" ;
 
console.log("员工号: "+emp.id); 
console.log("员工姓名: "+emp.name); 
console.log("员工邮箱: "+emp.email);

interface IPerson { 
    firstName:string, 
    lastName:string, 
    sayHi: ()=>string 
} 
 
var customer:IPerson = { 
    firstName:"Tom",
    lastName:"Hanks", 
    sayHi: ():string =>{return "Hi there"} 
} 
 
console.log("Customer 对象 ") 
console.log(customer.firstName) 
console.log(customer.lastName) 
console.log(customer.sayHi())  
 
var employee:IPerson = { 
    firstName:"Jim",
    lastName:"Blakes", 
    sayHi: ():string =>{return "Hello!!!"} 
} 
 
console.log("Employee  对象 ") 
console.log(employee.firstName) 
console.log(employee.lastName);


