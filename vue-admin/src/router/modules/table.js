

import Layout from '@/layout'

const tableRouter = {
    path: '/table',
    component: Layout,
    redirect: '/table/first-table',
    name: 'Table',
    meta: {
        title: 'Table',
        icon: 'table'
    },
    children: [
        {
            path: 'first-table',
            component: () => import('@/views/table/first-table'),
            name: 'FirstTable',
            meta: { title: 'First Table' }   
        },
        {
            path: 'statistical-ip',
            component: () => import('@/views/table/statistical-ip'),
            name: 'StatisticalIp',
            meta: { title: '渠道IP' }
        }
    ]
}
export default tableRouter