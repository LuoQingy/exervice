import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
/**
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * 
 */
export const constantRoutes = [
    {
        path:'/login',
        component:() => import('@/views/login/index'),
        hidden:true,
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index'),
          meta: { title: '首页', icon: 'dashboard' ,affix: true}
        }]
    },

    chartsRouter,
    tableRouter,
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})
  
const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
  
export default router;