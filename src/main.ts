import { createApp } from 'vue'
import storePinia from '@/stores'
import vue3SeamlessScroll from 'vue3-seamless-scroll'
import App from './App.vue'
import router from './routes'
// 公共less
import '@/styles/index.less'
import emptyDirectivePlugin from '@/directive/empty-directive'

// 创建pinia 实例
const app = createApp(App)

app.use(router).use(emptyDirectivePlugin).use(storePinia).use(vue3SeamlessScroll).mount('#app')
