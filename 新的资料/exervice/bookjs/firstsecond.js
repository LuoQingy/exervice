document.write('第一章值、类型和运算符'+'<br/>')
{
    let total = 0, count = 1;
    while(count<=10){
        total += count;
        count += 1;
    }
    console.log(total)
    function fac(n){if(n==0) return 1;else return fac(n-1)*n }
    console.log(fac(5))
   }
   {
    var luigis = 109;
    //undefined
    luigis = luigis - 35;
    console.log(luigis)
    //74
    //关键字不能作为变量名 
    //关键字和保留字的完整列表：break case catch continue default delete do else false  finally for function 
    //if implements in instanceof interface let new null package private protected public return static 
    // switch throw true try typeof var void while with yield this 
    Math.max(67,99)
    Math.min(88,33)+100;
    // confirm(new Date())
    // if(prompt('你好', '...')=='123456'){
    //      confirm(new Date())
    // }
   // var theNumber = Number(prompt('Pick a number','')); 
    // if(!isNaN(theNumber)){
    //     alert('your number is the square root of'+theNumber*theNumber)
    // }else{
    //     alert("Why didn't you give me a number？")
    // }
    //var num = Number(prompt('Pick a number','0')); 
    // if(num<10) confirm('my name is '+num);
    // else if(num<100) confirm('my name is '+num);
    // else confirm('my name is '+num);
    var number = 0;
    while(number<=12){
        console.log(number);
        number = number +2 ;}
   }
    for(let number2 =0;number2<=12;number2=number2+2){
            console.log(number2)
    }
    {
        var result2 =1;var counter2 =1 ;
        for(var counter2 =1 ;counter2<=10;counter2++){
            result2 = result2 *2;
        }
    }
    {
        for(var current=20; ; current++){
           
            if(current>10000){
                break;
            }
            if(current%7 !=0){
                continue;
            }
        }
        console.log(current)
    }
    {
        // switch(prompt('What is the weather like?')){
        //     case 'rainy':
        //         console.log('Remember to bring an umbrella')
        //         break;
        //     case 'sunny':
        //         console.log('Dress lightly')
        //         break
        //     case 'cloudy':
        //         console.log('Go outside');
        //         break;
        //     default :
        //         console.log('Unknown weather type!');
        //         break;
        // }
    }
    document.write('第二章'+'<br/>')
    {
        let sjx = '#######'
        for(let i=1; i<=7;i++){
           
            console.log(sjx.substr(0,i))
            
            
        }
        console.log('sjfjj')
    }
    {
        // for(let i=1;i<=100;i++){
        //     if(i%3==0 && i%5==0){
        //         console.log('FizzBuzz')
        //     }else if(i%3==0){
        //         console.log('Fizz')
        //     }else if(i%5==0){
        //         console.log('Buzz')
        //     }else{
        //         console.log(i)
        //     }
        // }
        let num =  1;
        // while(num<=100){
        //     if(num%3==0 && num%5==0){
        //         console.log('FizzBuzz')
        //     }else if(num%3==0){
        //         console.log('Fizz')
        //     }else if(num%5==0){
        //         console.log('Buzz')
        //     }else{
        //         console.log(num)
        //     }
        //     num++
        // }
    }
    function size(n,val1='#',val2=' '){
        let num = n*n;
        let content = '';
        console.log('djf'+val2 +'dff'+content+'mmnn')
        for(let i=1;i<=num;i++){
            if(Math.ceil(i/n)%2==1){
                
                if(i%n%2==1){
                    content += val1;
                }else{
                    content += val2;
                }
            }else{
                if(i%n%2==1){
                    content += val2;
                }else{
                    content += val1;
                }
                
            }
            if(i%n==0){
                 content += '\n';
            }
            
        }
        console.log(content)
        return content
        //for(let b)
    }
    size(10)
    
     console.log('sdfdsf\njkjjj')