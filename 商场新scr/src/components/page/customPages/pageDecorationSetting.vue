<template>
    <div class="page_decoration">
        <!--右边视图-->
        <div class="body">
            <div :is="view"></div>
        </div>
        <!--右边视图end-->
    </div>
</template>

<script>
    import PageView from './pageView'
    export default {
        components: {
            PageView,
        },
        data() {
            return {
                view: PageView
            }
        }
    }
</script>

<style lang="less" scoped>
    .page_decoration {
        height: 100%;
        display: flex;
        .left_select {
            width: 80px;
            padding: 50px 20px 0;
            border-right: 1px solid #CCCCCC;
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            align-items: center;
            .left_item {
                text-align: center;
                cursor:pointer;
                p{
                    margin: 15px 0;
                }
                .item_img{
                    width: 50px;
                    height: 50px;
                    border: 1px solid red;
                }
            }
            .bar{
                height: 2px;
                width: 80%;
                margin: 20px auto 30px;
                background: #ccc;
            }
        }
    }
</style>
