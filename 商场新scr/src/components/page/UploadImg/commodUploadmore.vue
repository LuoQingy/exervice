<template>
    <div class="vue-uploader">
        <div class="file-list">
            <section v-for="(file, index) of files" class="file-item draggable-item">
                <img :src="file.ciImagerUrl" alt="" ondragstart="return false;">
                <span class="file-remove" @click="remove(index)">+</span>
            </section>
            <section class="file-item" v-show="files.length < maxLen">
                <div @click="add" class="add">
                    <i class="el-icon-plus"></i>
                </div>
            </section>
        </div>
        <input type="file" accept="image/gif,image/jpeg,image/bmp,image/png" @change="fileChanged" :disabled="disabled" ref="file" multiple="multiple">
    </div>
</template>
<script>
import { formdata } from "../../../libs/formdata.js";
    export default {
        props: {
        	fileList: Array,
        	commodityPic: Boolean,
            maxLen: Number,
            disabled:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                status: 'ready',
                files: [],
                point: {},
                uploading: false,
            }
        },
        methods: {
            add() {
                this.$refs.file.click()
            },
            finished() {
                this.files = []
                this.status = 'ready'
            },
            remove(index) {
                this.files.splice(index, 1)
                this.$emit("fileList",this.files)
            },
            fileChanged() {
                const list = this.$refs.file.files
                
                     let formDate = formdata({
                        "file":list[0],
                        "role":1
                      });
                      this.$xwhttpAuth.post("/uploadImage", formDate).then(result => {
                        if (result.data.code === 10000) {
                          this.imageUrl = result.data.resp;
                          for (let i = 0; i < list.length; i++) {
                            const item = {
                                name: list[i].name,
                                size: list[i].size,
                                file: list[i],
                                ciIsFirst: false,
                                ciImagerUrl:this.imageUrl
                            }
                            this.files.push(item)
                            this.html5Reader(list[i], item)
                          }
                             this.$refs.file.value = ''
                        }
                      });
               
            },
            // 将图片文件转成BASE64格式
            html5Reader(file, item){
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.$set(item, 'src', e.target.result)
                    this.$emit("fileList",this.files)
                   
                }
                reader.readAsDataURL(file)
            },
            isContain(file) {//排除相同的
              return this.files.find((item) => item.name === file.name && item.size === file.size)
            },
            
        },
        watch: {
        	fileList: function(){
                this.files = this.fileList
                this.$emit("fileList",this.files)
                console.log(this.files)
        	}
        }
    }
</script>
<style scoped>
.vue-uploader .file-list{
	/*height: 170px;*/
	overflow: hidden;
}
.vue-uploader .file-list:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
}
.vue-uploader .file-list .file-item {
    float: left;
    position: relative;
    width: 87px;
    height: 87px;
    margin-right: 10px;
    text-align: center;
    border-radius: 5px;
    border: 1px dashed #ececec;
}
.vue-uploader .file-list .file-item.draggable-item{
    /* border: 1px solid #ececec; */
    border: 1px dashed #ececec;
}
.vue-uploader .file-list .file-item img{
    width: 87px;
    height: 87px;
}
.vue-uploader .file-list .file-item .file-remove {
    position: absolute;
    right: 5px;
    display: none;
    top: 5px;
    width: 20px;
    height: 20px;
    color: white;
    cursor: pointer;
    line-height: 20px;
    border-radius: 100%;
    transform: rotate(45deg);
    background: rgba(0, 0, 0, 0.5);
}
.vue-uploader .file-list .file-item:hover .file-remove {
    display: inline;
}
.vue-uploader .file-list .file-item .file-name {
    margin: 0;
    height: 40px;
    word-break: break-all;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.vue-uploader .file-list .file-item .mainPic{
	position: absolute;
	left: 0;
	bottom: 0;
	width: 150px;
	line-height: 40px;
	text-align: center;
	z-index: 99;
	background: rgba(242, 242, 242, 0.6);
}
.vue-uploader .file-list .file-item .mainPic i{
	font-style: normal;
	color: red;
}
.vue-uploader .add {
    width:120px;
    height: 120px;
    float: left;
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    cursor: pointer;
}
.vue-uploader .add .el-icon-plus{
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	font-size: 20px;
	color: #DBDBDB;
}


.vue-uploader .upload-func {
    display: flex;
    padding: 10px;
    margin: 0px;
    background: #f8f8f8;
    border-top: 1px solid #ececec;
}
.vue-uploader .upload-func .progress-bar {
    flex-grow: 1;
}
.vue-uploader .upload-func .progress-bar section {
    margin-top: 5px;
    background: #00b4aa;
    border-radius: 3px;
    text-align: center; 
    color: #fff;
    font-size: 12px;
    transition: all .5s ease;
}
.vue-uploader .upload-func .operation-box {
    flex-grow: 0;
    padding-left: 10px;
}
.vue-uploader .upload-func .operation-box button {
    padding: 4px 12px;
    color: #fff;
    background: #007ACC;
    border: none;
    border-radius: 2px;
    cursor: pointer;
}
.vue-uploader > input[type="file"] {
    display: none;
}
</style>