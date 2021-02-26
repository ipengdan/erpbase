<template>
  <div class="goodslist">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoods">
          <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table
    :data="goodsList"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="序号"
      width="50"
      align="center">
    </el-table-column>
    <el-table-column
      prop="goods_name"
      label="商品名称"
      width="800"
      align="center">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格(元)"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="goods_weight"
      label="商品重量"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="add_time"
      label="创建时间"
      width="200"
      align="center">
      <template slot-scope="scope">
        {{scope.row.add_time | dateFormat}}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center">
      <template slot-scope="scope">
        <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
          <el-button type="primary" @click="editGoods(scope.row)">编辑</el-button>
        </el-tooltip>
        <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
          <el-button type="danger" @click="deleteGoods(scope.row)">编辑</el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getGoodsList,
  deleteGoods
} from '../../network/goods'

export default {
  name: 'GoodsList',
  data() {
    return {
      showEditGoods: false,
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      editGoodsForm: {

      },
      editGoodsFormRules: {

      }
    }
  },
  created() {
    this.getGoods();
  },
  methods: {
    getGoods(){
      getGoodsList(this.queryInfo).then(res=>{
        if(res.meta.status == 200) {
          this.goodsList = res.data.goods;
          this.total = res.data.total;
          this.$message.success('获取商品列表成功');
        }else {
          this.$message.error('获取商品列表失败');
        }
      });
    },
    addGoods(){
      this.$router.push('/goods/add');
    },
    searchGoods(){
      this.getGoods();
    },
    deleteGoods(row){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoods(row.goods_id).then(res=>{
            if(res.meta.status == 200) {
              this.getGoods();
              this.$message.success('删除成功');
            }else {
              this.$message.error('删除失败');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    editGoods(row){
      this.showEditGoods = true;
    },
    comfirmEditGoods(){

    },
    handleSizeChange(val){
      this.queryInfo.pagesize = val;
      this.getGoods();
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum = val;
      this.getGoods();
    }
  }
}
</script>

<style lang="scss" scoped>
.goodslist {

  .el-table {
    margin-top: 20px;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>