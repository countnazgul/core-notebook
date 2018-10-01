import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  MdField,
  MdButton,
  MdDialog,
  MdDialogConfirm,
  MdEmptyState,
  MdList,
  MdApp,
  MdDrawer,
  MdToolbar,
  MdContent,
  MdMenu,
  MdTable,
  MdCard,
  MdRipple,
  MdProgress,
  MdSnackbar
} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import VModal from 'vue-js-modal'
 
Vue.use(VModal)

Vue.use(MdField)
Vue.use(MdButton)
Vue.use(MdDialog)
Vue.use(MdDialogConfirm)
Vue.use(MdEmptyState)
Vue.use(MdList)
Vue.use(MdApp)
Vue.use(MdToolbar)
Vue.use(MdDrawer)
Vue.use(MdContent)
Vue.use(MdMenu)
Vue.use(MdTable)
Vue.use(MdCard)
Vue.use(MdRipple)
Vue.use(MdProgress)
Vue.use(MdSnackbar)


// md-app-toolbar
// md-app-drawer
// md-app-content


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
