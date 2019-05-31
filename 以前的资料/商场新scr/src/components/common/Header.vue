<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="header_flex">
            <div class="collapse-btn" @click="collapseChage">
                <i class="el-icon-menu"></i>    
            </div>
            <div class="logo">贝壳商业综合体管理后台</div>
        </div>
        <div class="header_flex">
            <!-- <div class="header_list">
                <span class="header_btn">联系贝壳</span>
                <span class="header_btn">帮助中心</span>
            </div> -->
            <div class="header-right">
                <div class="header-user-con">
                    <!-- 用户头像 -->
                    <div class="user-avator"><img src="static/img/img.jpg"></div>
                    <!-- 用户名下拉菜单 -->
                    <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{username}} <i class="el-icon-caret-bottom"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <el-dropdown-item>安全设置</el-dropdown-item> -->
                            <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'linxin',
                message: 2
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            // 用户名下拉菜单  选择退出登录
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('token')
                    sessionStorage.removeItem('CurrenRoute')
                    this.$router.push('/login');
                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            }
        },
        mounted(){
            // if(document.body.clientWidth < 1500){
            //     this.collapseChage();
            // }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        font-size: 18px;
        color: #fff;
        display: flex;
        justify-content: space-between;
    }
    .header_flex{
        display: flex;
    }
    .collapse-btn{
        padding: 0 21px;
        cursor: pointer;
        line-height: 50px;
    }
    .header .logo{
        width:250px;
        line-height: 50px;
    }
    .header_list{
        margin-right: 100px;
        font-size: 16px;
        cursor: pointer;
        line-height: 50px;
    }
    .header_list .header_btn{
        padding: 20px 30px;
    }
    .header-right{
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 50px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
