export  const formdata = function(obj){
       let data =  new FormData();
        for(let val in obj){
            data.append(val,obj[val])
        }
        return data;
}