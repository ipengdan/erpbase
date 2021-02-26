<template>
  <el-container>
    <el-header>
      <div class="head-left">
        <img src="../assets/logo.png" alt="">
        <span>湖南科技学院</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse? '64px':'200px'">
        <div class="collapse-trigger" @click="collapseAction">|||</div>
        <el-menu
          :collapse="iscollapse"
          :collapse-transition="false"
          router
          :default-active="activeRouter"
          background-color="#23232c"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!--一级菜单-->
          <el-submenu :index="'/'+item.path" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="menuIcons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单-->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveActiveRouter(subItem.path)">
            <template slot="title">
              <i :class="menuIcons[subItem.id]"></i>
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <navigator-bar/>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getRouter} from '../network/common'
import NavigatorBar from './navbar/NavigatorBar.vue'

export default {
  name: 'Home',
  components: {
    NavigatorBar
  },
  data() {
    return {
      iscollapse: false,
      activeRouter: '',
      menus: [],
      menuIcons: {
        125: 'el-icon-user-solid',
        103: 'el-icon-lock',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data',
        110: 'el-icon-s-shop',
        111: 'el-icon-s-marketing',
        112: 'el-icon-s-flag',
        104: 'el-icon-s-finance',
        115: 'el-icon-s-claim',
        121: 'el-icon-s-fold',
        107: 'el-icon-s-unfold',
        146: 'el-icon-s-cooperation'
      }
    }
  },
  created () {
    this.getLeftMenus();
  },
  methods: {
    logout () {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    getLeftMenus () {
      getRouter().then(res => {
        console.log(res);
        if(res.meta.status == 200) {
          this.menus = res.data;
        }
      });
    },
    collapseAction () {
      this.iscollapse = !this.iscollapse;
    },
    saveActiveRouter (path) {
      this.activeRouter = '/' + path;
      this.$store.commit('commonMd/ACTIVEROUTER', this.activeRouter);
      //window.sessionStorage.setItem('activeRouter', this.activeRouter);
    }
  }
}
</script>

<style lang="scss" scoped>

.el-container {
  height: 100%;

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color:	#333a41;
    padding-left: 0;

    .head-left {
      display: flex;
      align-items: center;

      img {
        width: 60px;
        height: 60px;
      }

      span {
        color: #fff;
      }
    }
  }

  .el-container {

    .el-aside {
      background-color:	#23232c;

      .collapse-trigger {
        line-height: 24px;
        color: #fff;
        font-size: 10px;
        letter-spacing: .3em;
        text-align: center;
        cursor: pointer;
      }

      .el-menu {
        border-right: none;
      }
    }

    .el-main {
      background-color:	#D3D3D3;
    }
  }
}

</style>