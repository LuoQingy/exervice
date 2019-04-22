<template>
    <div>
        <canvas id="myCanvas">your browser does not support the canvas tag </canvas>
        <img style="width:100%;" src="https://static.geetest.com/pictures/gt/1e6ca4d3f/1e6ca4d3f.webp" alt="">
        <div style="opacity:0;position:absolute;bottom:0;" id="qrcode"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            downloadUrl:''
        }
    },
    mounted(){
        this.changed()
    },
    methods:{
        changed(){
            // var canvas = document.getElementById('myCanvas');
            // var ctx = canvas.getContext('2d');
            //     ctx.fillStyle='#FF';
            // var img=new Image()
            // img.src="https://static.geetest.com/pictures/gt/1e6ca4d3f/1e6ca4d3f.webp";

            // ctx.drawImage(img,12,58,98,36,43,95,62,15,12);
            // ctx.fillRect(12,58,98,36,43,95,62,15,12);
            var c=document.getElementById("myCanvas");
            var cxt=c.getContext("2d");
            var img=new Image()
            img.src="https://static.geetest.com/pictures/gt/1e6ca4d3f/1e6ca4d3f.webp";
            cxt.drawImage(img,12,0);

        },
        changeimg(){
           
        }
    }
}
</script>
