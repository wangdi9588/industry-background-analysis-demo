import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/layout/index.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/industryOverview',
    children: [
      {
        path: '/industryOverview',
        name: 'industryOverview',
        component: () => import('@/views/industryOverview/index.vue'),
        meta: {
          title: '产业总览',
          type: 'industryOverview'
        }
      },
      {
        path: '/businessEntity',
        name: 'businessEntity',
        component: () => import('@/views/businessEntity/index.vue'),
        meta: {
          title: '经营主体',
          type: 'businessEntity'
        }
      },
      {
        path: '/techInnovation',
        name: 'techInnovation',
        component: () => import('@/views/techInnovation/index.vue'),
        meta: {
          title: '科技创新',
          type: 'techInnovation'
        }
      },
      {
        path: '/developmentQuality',
        name: 'developmentQuality',
        component: () => import('@/views/developmentQuality/index.vue'),
        meta: {
          title: '发展质量',
          type: 'developmentQuality'
        }
      },
      {
        path: '/regionalBenchmark',
        name: 'regionalBenchmark',
        component: () => import('@/views/regionalBenchmark/index.vue'),
        meta: {
          title: '区域对标',
          type: 'regionalBenchmark'
        }
      }
    ]
  }
]
const router = createRouter({ history: createWebHashHistory(), routes })
export default router
