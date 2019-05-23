let typeData = [
    "推荐",
    "美食",
    "旅游",
    "时尚",
    "健康",
    "汽车",
    "娱乐",
    "猎奇",
    "社会",
    "财经",
    "体育",
    "国内",
    "家居",
    "科技",
    "电视",
    "NBA",
    "人文",
    "数码"];
var vm = new Vue({
    el: '#app',
    data:{
        name:'yu',
        typeData:typeData,
        newType:'',
        adSrcList: [
            { src: '//static.sealk.cn/static/js/50c366ab03e428e042f034dc84b899dd.js', class: 'nb_120' },
            { src: '//static.sealk.cn/static/js/ddff4be24ef4b6b68944a43f125ba8ba.js', class: 'nb_121' },
            { src: '//static.sealk.cn/static/js/f0475f11b846abb01ca3b26359162f03.js', class: 'nb_122' },
            { src: '//static.sealk.cn/static/js/3e926a2a1e1663177306dd8c0d3fcc12.js', class: 'nb_123' },
            { src: '//static.sealk.cn/static/js/63507fbe24ccd61f77878d999bb33c19.js', class: 'nb_124' },
            { src: '//static.sealk.cn/static/js/4c11ce5970b897d04b011a075c103393.js', class: 'nb_125' },
            { src: '//static.sealk.cn/static/js/aa7622fea9bb88cc4db6d775b0303694.js', class: 'nb_126' }
          ],
    },
    mounted(){
        
        localStorage.setItem(typeData[0],typeData[1]);
        localStorage.setItem(typeData[2],typeData[3]);
        localStorage.setItem(typeData[4],typeData[5]);
        localStorage.setItem(typeData[6],typeData[7]);
        localStorage.setItem("typeData",typeData);
        sessionStorage.setItem("typeData",typeData)
        console.log(localStorage)
        console.log('sessionStorage',sessionStorage)
        console.log('mounted')
    },
    methods:{

    },
    watch:{

    }
})
console.log('数据'+vm.name)