<template>
    <div>
        <m-header></m-header>
        <keep-alive include="Home">
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if ="!$route.meta.keepAlive"/>
        <div class="test"></div>
    </div>
</template>

<script>
import mHeader from './m-header/m-header.vue'
export default {
    components: { mHeader},
    data(){
        return{

        }
    }
}
</script>

<style scoped>

</style>
