document.write('第三章函数'+'<br/>');
console.log('第三章')
//函数定义
function square(x){
    return x*x
}
console.log(square(20))
{
    let makeNoise = function(){
        console.log('Pling')
    }
    makeNoise()
     
    let power = function(base,exponent){
        let result = 1;
        for(let i=0;i<exponent;i++){
            result*= base;

        }
        return result;
    }
    console.log(power(2,10));

}
{//嵌套作用域
    let landscape = function(){
        let result = '';
        let flat = function(size){
            for(let i=0;i<size;i++){
                result +='_';
            }
        };
        let mountain = function(size){
            result += '/';
            for(let i=0;i<size;i++){
                result +='"';
            }

        }
        flat(3);
        mountain(3);
        flat(6);
        mountain(6);
        flat(1);
        return result;
    }
    console.log(landscape())
}
//调用栈
{
    var num = 0;
    function chicken(){
        num++;
        return egg();

    }
    function egg(){
        if(num >5){
            return num;
        }else{
            return chicken()
        }
    }
    console.log(chicken()+'came first')
    function computeMaxCallStackSize() {
        try {
            return 1 + computeMaxCallStackSize();
        } catch (e) {
            // Call stack overflow
            return 1;
        }
    }
    console.log(computeMaxCallStackSize())
    //可选参数
    function powers(base,exponent=null){
        exponent = exponent ||2;
        let result = 1;
        for(let i=0;i<exponent;i++){
            result *= base;

        }
        return result;
    }
    console.log(powers(4));
    console.log(powers(4,4))
}
{//闭包
    function wrapValue(n){
        var localVariable = n;
        return function(m=0){
            return localVariable+m;

        }
    }
    let warp1 = wrapValue(1);
    let warp2 = wrapValue(78);
    console.log(warp1());
    console.log(warp1(2));
    console.log(warp2(2));
}
{//递归
    function pos(base,val){

        if(val==0){
            return 1;
        }else{
            return base*pos(base,val-1)
        }
    }
    console.log(pos(3,10))
    function newVal(base,val=0){
        let result = 1;
        for(let i=0;i<val;i++){
            result *= base;
        }
        return result;
    }
    console.log(newVal(3,10))
}//
{
    function printFarmInventory(cows,chickens){
        let cowString = String(cows);
        while(cowString.length<3){
            cowString = '0'+ cowString;
        }
        console.log(cowString +': cows');
        let chickensString = String(chickens);
        while(chickensString.length<3){
            chickensString = '0'+ chickensString;
        }
        console.log(chickensString+': Chickens')
        
    }
    printFarmInventory(11111,12);
    //封装函数
    function printVal(number,width){
        let numberString = String(number);
        while(numberString.length<width){
           return numberString = '0'+ numberString;
        }

    }
    function printDa(cows,chickens,pigs){
        console.log(printVal(cows,5) + ': cows');
        console.log(printVal(chickens,5) + ': chickens');
        console.log(printVal(pigs,5) + ': pigs');
        console.log(cows,chickens,pigs)
    }
    printDa(5,13,96)
    console.log(Math.min('333l',233))

}
//第三章习题
console.log('第三章习题')
{//1
    //console.log(Math.min(12,33,2,8))
    function firstExervice(val=null,setcond=null){
        if(Number(val)>Number(setcond)){
            return Number(setcond);
        }else if(Number(val)<Number(setcond)){
            return Number(val);
        }else {
            return NaN;
        }
    }
    console.log(firstExervice(22,233))
    console.log(firstExervice('111',233))
}
{//2
    function isEven(newNum){
        let number= Math.abs(newNum)
        if(number==1){
            return true;
        }else if(number==0){
            return false;
        }else{
          return  isEven(number-2)
        }
    }
    console.log(isEven(50));
    console.log(isEven(75));
    console.log(isEven(-1));
}
{//3
   let str = 'SDGFDSJFGDKJGJFDKJHJDGGHJFDJHDHFGDHJHHH艰苦看见好看好看HHHHHHHHHHHHHHjsdahfjkhdsihvfisdjgkjdjndbvjxnbvjdsgfldsjgsdjewiiqqwertyuiop[zxcvbnm';
   function strFn(val,num=null,check=null){
        let value = val;
        if(check){
            value = val.toLowerCase();
        }
        let obj = {};
        for(let i=0;i<value.length;i++){
            if(obj[value[i]]){
                obj[value[i]]++;
            }else{
                obj[value[i]]=1;
            }
        }
        let max_key,max_num=0;
        for(let key in obj){
            if(num){
                if(key == num){
                    max_num = obj[key];
                    max_key = key;
                   
                }
                // else{
                //     max_num = obj[key];
                //     max_key = key;
                // }

            }else{
                if(max_num<obj[key]){
                    max_num = obj[key];
                    max_key = key;
                }
            }
        }
        return max_key+':'+max_num
   }
   console.log(strFn(str, '', true))
}