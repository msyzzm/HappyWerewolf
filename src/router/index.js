import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from '../views/Game'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Game',
    component: Game
  },
  {
    path: '/room/:roomID',
    name: 'GameRoom',
    component: Game
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
