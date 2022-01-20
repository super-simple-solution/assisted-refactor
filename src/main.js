import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import '@/style.scss'

import * as Icons from '@ant-design/icons-vue'

const app = createApp(App)

const icons = Icons
for (const i in icons) {
    // 循环注册组件
    app.component(i, icons[i])
}

app.use(router)

app.mount('#app')
