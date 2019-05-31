//console.log(this.$http);
//console.log("this.$http");
var copy = function copyContent(http,url,id){
    console.log(http.id);
    http.get(url, {}).then(res => {
        console.log(res.data)
        var copyContent = document.getElementById(id);
        copyContent.innerHTML =res.data
        console.log(copyContent.innerHTML);
        copyContent.onclick = function(ev){
                console.log(ev)
                if (document.body.createTextRange) { // 该属性只有IE支持
                        var range = document.body.createTextRange();
                        range.moveToElementText(copyContent);
                        console.log(copyContent)
                        range.select();
                        document.execCommand('Copy');
                        //alert('已复制1');
                } else if (window.getSelection) {
                        var selection = window.getSelection();
                        selection.removeAllRanges();
                        var range = document.createRange();
                        console.log(copyContent)
                        range.selectNodeContents(copyContent);
                        selection.addRange(range);
                        document.execCommand('Copy');
                        selection.removeAllRanges();
                        //alert('已复制2');
                }
        }

      }).catch(err => {
        
      })
};