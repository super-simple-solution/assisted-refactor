// router.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Proto from './views/proto.vue'

const routes = [{ path: '/', component: Proto }]

export default createRouter({
  history: createWebHashHistory(),
  routes
})