<template>
  <div class="navbtn">
    <el-button :type="isActive? 'primary':''" size="mini" @click="goPage(routerItem.path)">{{routerItem.name}}</el-button>
    <img src="../../assets/images/common/close.png" @click="closeRouter" alt="">
  </div>
</template>

<script>
export default {
  name: 'NavBtn',
  props: {
    routerItem: {
      type: Object,
      default: {}
    },
    index: {
      type: Number,
      default: -1
    },
    showClose: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeRouter () {
      this.$store.commit('commonMd/DELETEROUTER', this.routerItem);
    },
    goPage(path){
      this.$router.replace(path);
      this.$store.commit('commonMd/ACTIVEROUTER', path);
      //window.sessionStorage.setItem('activeRouter', path);
    }
  },
  computed: {
    isActive () {
      if(this.routerItem.path == this.$store.state.commonMd.activeRouter) {
        return true;
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbtn {
  position: relative;
  display: inline;
  margin-right: 10px;

  img {
    position: absolute;
    display: none;
    width: 12px;
    height: 12px;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }

  &:hover {
    img {
      display: block;
    }
  }
}
</style>