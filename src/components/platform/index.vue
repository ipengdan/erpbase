<template>
  <div class="platform-mgr">
    <div class="mgr-cate">
      <div class="mgr-cate-item" v-for="(item,idx) in cateList" :key="idx" @click="cateItemClicked(item.path)">
        {{item.name}}
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  components: { },
  data(){
    return{
      cateList: [
        {path:'schoolmgr',name:'校园管理'},
        {path:'rolerights',name:'角色授权'},
        {path:'accountmgr',name:'账号管理'},
        {path:'tagcate',name:'标签类别'},
        {path:'checksetting',name:'审核设置'}]
    }
  },
  created(){

  },
  methods:{
    cateItemClicked(path){
      this.$router.push(path);
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-mgr{
  width: 100%;
  .mgr-cate{
    display: flex;
    background-color: #fff;
    .mgr-cate-item{
      font-size: 24px;
      font-weight: bold;
      padding: 30px 40px;
    }
  }
}
</style>