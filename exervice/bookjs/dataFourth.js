document.write('第四章数据结构:对象和数组'+'<br/>');
console.log('第四章数据结构：对象和数组');
// 数据集 属性 方法 对象 可变性 记录 计算关联性 对象映射 分析结果
let lisOf = [1,22,22,3,4,45,55,34];
console.log(lisOf[4]);
console.log(lisOf[4-2]);
console.log(lisOf['length']);
let doh = 'dah';
console.log(typeof doh.toUpperCase);
console.log( doh.toUpperCase());
let mack = [];
mack.push('mack');
mack.push('the','knife');
console.log(mack)
mack.push(lisOf);
console.log(mack);
console.log(mack.pop())
console.log(mack);
console.log(mack.unshift(';'));
console.log(mack);
let anObject = {left:1,right:3,name:'yu',sex:true,year:18};
console.log(anObject.left);
delete anObject.left;
console.log(anObject);
console.log('left' in anObject);
console.log('name' in anObject);
console.log('记录开始');
{
    let journal = [];
    function abbEbtry(events,didSquirrel){
        journal.push({
            events:events,
            squirrel:didSquirrel
        })
    }
    abbEbtry(['work','touched tree','pizza','running','television'],false);
    abbEbtry(['work','ice cream','cauliflower','lasagna','touched tree'],false);
    abbEbtry(['work','cycling','break','peanuts','beer'],true);
    console.log(journal);
    function phi(table){
        return (table[3]*table[0]-table[2]*table[1])/
                Math.sqrt((table[2]+table[3])*
                        (table[0]+table[1])*
                        (table[1]+table[3])*
                        (table[0]+table[2]))      
    }
    console.log(phi([76,23,4,3]));
    console.log(phi('发生次数'));
    function hasEvent(event,entry){
        return entry.events.indexOf(event) != -1;
    }
    function tableFor(event,journal){
        let table = [0,0,0,0];
        for(let i=0;i<journal.length;i++){
            let entry =journal[i],index=0;
            if(hasEvent(event,entry)){
                index +=1;
            }
            if(entry.squirrel){
                index +=2;
            }
            table[index] +=1;
        }
        return table;
    }
}



//1
function range(one,two,sep=1){
    let arr = [];
    let step = Math.abs(sep)
    if(one>two){
        for(let i=one;i>=two;i-=step){
            arr.push(i)
        }
    }else{
        for(let i=one;i<=two;i+=step){
            arr.push(i)
        }
    }
    
    return arr;
}
console.log(range(1,9));
console.log(range(9,1))
function sum(list){
    let num =0;
    for(let i=0;i<list.length;i++){
        num += list[i]
    }
    return num;
}
console.log(sum(range(1,100)));
console.log(sum(range(10,1,-1)));

let a = range(1,9);
let arr = [];

arr.sort(randomSort);
console.log(arr.sort(randomSort))
function randomSort(a, b) { return Math.random() > 0.5 ? -1 : 1; }



function shuffle(arr) {
    for (let i=arr.length-1; i>=0; i--) {
        let rIndex = Math.floor(Math.random()*(i+1));
        // 打印交换值
        // console.log(i, rIndex);
        let temp = arr[rIndex];
        arr[rIndex] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
console.log('逆转数组'+range(1,9).reverse())

//在乱序的同时，固定一个下标的值，使其位置不变，方法有很多，这里只给出一种：

function shuffle(arr, index) {
    let res = [];
    // 取出固定值
    let fix = arr.splice(index, 1)[0];
    for (let i=arr.length-1; i>=0; i--) {
        let rIndex = Math.floor(Math.random()*(i+1));
        res.push(arr[rIndex]);
        arr.splice(rIndex, 1);
    }
    // 将固定值放入指定位置
    res.splice(index, 0, fix);
    return res;
}

let list = range(1,15);
function reverseArray(){
    let arr = arguments;
    let newArr = [];
    for(let i=arr.length-1;i>=0;i--){
        newArr.push(arr[i]);
    }
    return newArr;
}
function reverseArrayInPlace(num){
    let arr = num;
    let newArr = [];
    for(let i=arr.length-1;i>=0;i--){
        newArr.push(arr[i]);
    }
    return newArr;
}
console.log(reverseArrayInPlace(range(1,13)))
console.log(reverseArray(1,20,3,4,5,6,7,8,9,60))


{//去掉数组里面包含的属性
    function ObjectArray(obj,arr){
        let obj2 = obj;
        for(let i=0;i<arr.length;i++){
            for(let key in obj){
                if(arr[i]==key){
                    delete obj2[key]
                }
            }
        }
        return obj2;
    }
    let obj ={
        a:'2',
        b:'324',
        name:'sss',
        c:'true',
        d:'yu',
        e:'english',
        f:'eart',
    }
    let arr = ['a','b','c','d']
    console.log(ObjectArray(obj,arr));

}
{// 3
        var egs = [
            {name_1: 'name_1...'},
            {name_2: 'name_4...'},
            {name_3: 'name_3...'},
            {name_0: 'name_0...'},
        ]
        var result = {}
        var key ='children'
        s(egs)

        function s(arrs) {
            arrs.forEach((o, i) => {
                //console.log('---'+ i + ': ', result)
                if (!result[key]) {
                    result[key] = [o]
                } else {
                    o[key] = [result]
                    result = o
                }
             })
        }

        console.log(result);
        var obj = {};
        var newKey ='rest'
        var lists = [1,2,3,4];
        var listObj = [];
        for(let i=0;i<lists.length;i++){
            let obj2 = {
                value:lists[i],
                rest:'th',
            }
            if(i==lists.length-1){
                obj2.rest = null;
            }
            listObj.push(obj2)
        }
        console.log(lists.reverse());
        console.log(listObj);
        let newList = listObj.reverse();
        function arrayToList(arrs){
            arrs.forEach((o, i) => {
                console.log('---'+ i + ': ', obj);
                if (!obj[newKey]) {
                    obj[newKey] = o;
                    console.log('第几个：'+i);
                    console.log(obj);
                } else {
                    o[newKey] = obj;
                    obj = o;
                }
             })
        }
        arrayToList(newList);
        console.log(obj)
}



















