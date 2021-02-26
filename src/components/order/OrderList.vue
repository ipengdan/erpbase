<template>
  <div class="orderlist">
    <el-card>
      <el-row>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrders">
          <el-button slot="append" icon="el-icon-search" @click="getOrders"></el-button>
        </el-input>
      </el-row>

      <el-table
    :data="orders"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="序号"
      width="60">
    </el-table-column>
    <el-table-column
      prop="order_number"
      label="订单编号">
    </el-table-column>
    <el-table-column
      prop="order_price"
      label="订单价格">
    </el-table-column>
    <el-table-column
      prop="pay_status"
      label="是否付款">
      <template slot-scope="scope">
        <el-tag type="warning" v-if="scope.row.pay_status == 0">未付款</el-tag>
        <el-tag type="info" v-else>已付款</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="is_send"
      label="是否发货">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="下单时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
          <el-button type="success" icon="el-icon-edit"></el-button>
        </el-tooltip>
        <el-tooltip :enterable="false" effect="dark" content="地址" placement="top">
          <el-button type="success" icon="el-icon-location-outline"></el-button>
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
import{
  getOrderList
} from '../../network/order'

export default {
  name: 'OrderList',
  data(){
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orders: []
    }
  },
  created(){
    this.getOrders();
  },
  methods:{
    getOrders(){
      getOrderList(this.queryInfo).then(res=>{
        if(res.meta.status == 200) {
          this.orders = res.data.goods;
          this.total = res.data.total;
          this.$message.success('获取订单成功');
        }else{
          this.$message.error('获取订单失败');
        }
      });
    },
    handleSizeChange(val){
      this.queryInfo.pagesize = val;
      this.getOrders();
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum = val;
      this.getOrders();
    },
    searchGoods(){
      this.getOrders();
    }
  }
}
</script>

<style lang="scss" scoped>
.orderlist{

  .el-input{
    width: 500px;
  }

  .el-table{
    margin-top: 20px;
  }

  .el-pagination {
    margin-top: 20px;
  }
}
</style>