import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Server from './components/Server.vue'
import Config from './components/Config.vue'
import NotesMgmnt from './components/NotesMgmnt.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/server',
      name: 'server',
      component: Server,
      props: true
    },
    {
      path: '/config',
      name: 'config',
      component: Config,
      props: true
    },
    {
      path: '/notesmgmnt',
      name: 'notesmgmnt',
      component: NotesMgmnt,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
