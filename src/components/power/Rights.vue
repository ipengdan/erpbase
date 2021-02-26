<template>
  <div class="right">
    <el-card>
      <el-table
    :data="rightTabs"
    border
    stripe
    style="width: 100%">
    <el-table-column
      prop="authName"
      label="权限名称"
      align="center">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径"
      align="center">
    </el-table-column>
    <el-table-column
      prop="level"
      label="权限等级"
      align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.level == 0">一级</el-tag>
        <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
        <el-tag type="info" v-if="scope.row.level == 2">三级</el-tag>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  getRights
} from '../../network/power'

export default {
  name: 'Rights',
  data() {
    return {
      rightTabs:[]
    }
  },
  created() {
    this.getRights('list');
  },
  methods: {
    getRights(type) {
      getRights(type).then(res => {
        if(res.meta.status == 200) {
          this.rightTabs = res.data;
        }else {
          this.$message.error(res.meta.msg);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>