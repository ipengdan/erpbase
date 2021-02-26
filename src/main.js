import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import types from './store/types'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import scroll from 'best-scroll'
Vue.use(scroll)

Vue.config.productionTip = false
Vue.use(elementui)
Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormat',function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2,'0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

router.beforeEach((to, from, next)=>{
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  store.commit('commonMd/'+types.ADDROUTER, {'path':to.path, 'name':to.name});
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
