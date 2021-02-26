<template>
  <div class="navigator-bar">
    <nav-btn v-for="(item,indx) in getRoutes" :routerItem="item" :index="indx" :key="item.path"/>
  </div>
</template>

<script>
import NavBtn from './NavBtn.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'NavigatorBar',
  components: {
    NavBtn
  },
  computed: {
    getRoutes () {
      return this.$store.state.commonMd.historyRouter;
    }
  }
}
</script>

<style lang="scss" scoped>
.navigator-bar {
  width: 100%;
  height: 40px;
}
</style>