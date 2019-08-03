

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
        },
        {
            path: 'merchant-table1',
            component: () => import('@/views/table/merchant-table1'),
            name: 'MerchantTable1',
            meta: { title: '商城商户1' }
        },
        {
            path: 'merchant-table2',
            component: () => import('@/views/table/merchant-table2'),
            name: 'MerchantTable2',
            meta: { title: '商城商户2' }
        },
        {
            path: 'merchant-table3',
            component: () => import('@/views/table/merchant-table3'),
            name: 'MerchantTable3',
            meta: { title: '商城商户3' }
        },
    ]
}
export default tableRouter