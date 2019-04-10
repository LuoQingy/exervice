<template>
    <div :class="['notice_ment',{'margin_bottom':dataJson.hideBlank !== true}, {'active':index == curIndex}]">
        <div id="notice-infor" class="body_view" @click="getIndex">
            <div class="fl notice-icon">
                <img :src="dataJson.imgUrl" alt="">
            </div>
            <div class="fl notice-title">
                <ul :class="{anim:animate==true}">
                    <li v-for="(item,index) in list"
                        :key="index"
                        :style="{color:item.annColor}">
                        {{item.annTitle}}
                    </li>
                </ul>
            </div>
        </div>
        <edit-btn :index="index" @changeUsedNum="changeUsedNum">
            <notice-ment_edit :index="index"></notice-ment_edit>
        </edit-btn>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';
    import EditBtn from './EditBtn';
    import NoticeMent_edit from './NoticeMent_edit';
    export default {
        props: {
            index: {
                type: Number
            },
            imgUrl:{
                type:String
            }
        },
        components: {
            EditBtn,
            NoticeMent_edit
        },
        data() {
            return {
                animate: false,
                noticeTimer: null,
                list:[]
            }
        },
        computed: {
            // ...mapState(['dragContent']),
            ...mapGetters({
                curIndex: 'getCurIndex',
                dragContent: 'getDragContent'
            }),
            dataJson() {
                this.list = [...this.dragContent[this.index].dataJson.anIdList];
                return this.dragContent[this.index].dataJson;
            }
        },
        mounted() {
            this.noticeTimer = setInterval(this.scrollEvent, 1500);
        },
        destroyed() {
            clearInterval(this.noticeTimer);
        },
        methods: {
            ...mapMutations([
                'changeCurIndex'
            ]),
            getIndex() {
                this.index !== this.curIndex ?
                    this.changeCurIndex(this.index) :
                    this.changeCurIndex(undefined)
            },
            changeUsedNum(data) {
                this.$emit('changeUsedNum', data);
            },
            scrollEvent() {
                if (this.list.length == 1) {
                    return;
                }
                this.animate = true;
                setTimeout(() => {
                    this.list.push(this.list[0]);
                    this.list.shift();
                    this.animate = false;
                }, 5000)
            }
        }
    }
</script>


<style lang="less" scoped>
    img, div, span, p, ul, li {
        margin: 0;
        padding: 0;
    }

    .notice_ment {
        position: relative;
        height: 38px;
        border-width: 2px;
        border-style: solid;
        background: #f2f2f2;
        border-color: #F7F7F9 #F7F7F9 transparent #F7F7F9;
        #notice-infor {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            background: #fff;
            overflow: hidden;
            .fl {
                float: left;
            }

            .fr {
                float: right;
            }

            .notice-icon {
                padding: 0.4rem 0.7rem 0rem 0.5rem;
                img {
                    width: 25px;
                    height: 25px;
                }
            }
            .notice-title {
                width: 8rem;
                height: 100%;
                .anim {
                    height: 100%;
                    transition: all 1s;
                    margin-top: -38px;
                }
                ul {
                    li {
                        height: 100%;
                        line-height: 38px;
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .margin_bottom {
        margin-bottom: 15px;
    }

    .active {
        border-color: #3089DC;
    }
</style>
