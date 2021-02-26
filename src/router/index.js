import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/',redirect:'/login' },
  {path: '/login',name: '登录',component: Login},
  {
    path: '/home', 
    name: '首页',
    component: () => import('../components/Home.vue'),
    redirect: '/welcome',
    children:[
      {path:'/welcome', name:'欢迎页', component: () => import('../components/Welcome.vue')},
      {path: '/users',name:'用户列表', component: () => import('../components/user/UserList.vue')},
      {path: '/rights',name: '权限管理', component: () => import('../components/power/Rights.vue')},
      {path: '/roles', name: '角色列表', component: () => import('../components/power/RoleList.vue')},
      {path: '/categories', name: '商品分类', component: () => import('../components/goods/Category.vue')},
      {path: '/params', name: '商品参数', component: () => import('../components/goods/GoodsParams.vue')},
      {path: '/goods', name: '商品列表', component: () => import('../components/goods/GoodsList.vue')},
      {path: '/goods/add', name: '添加商品',component: () => import('../components/goods/AddGoods.vue')},
      {path: '/orders', name: '订单列表', component: ()=> import('../components/order/OrderList.vue')},
      {
        path: '/reports',
        name:'报表', 
        component:()=>import('../components/platform/index.vue'),
        redirect: '/schoolmgr',
        children: [
          {path:'/schoolmgr', name:'校园管理', component: () => import('../components/platform/children/SchoolMgr.vue')},
          {path:'/rolerights', name:'角色授权', component: () => import('../components/platform/children/RoleRights.vue')},
          {path:'/accountmgr', name:'账号管理', component: () => import('../components/platform/children/AccountMgr.vue')},
          {path:'/tagcate', name:'标签类别', component: () => import('../components/platform/children/TagCategory.vue')},
          {path:'/checksetting', name:'审核设置', component: () => import('../components/platform/children/CheckSetting.vue')}
        ]
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
