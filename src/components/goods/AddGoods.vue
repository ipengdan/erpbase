<template>
  <div class="addgoods">
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>

      <el-steps :active="activeStep-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsRef" label-width="100px" label-position="top">
      <el-tabs tab-position="left" v-model="activeStep" @tab-click="tableClicked" :before-leave="beforeLeave">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addGoodsForm.goods_cat"
              :options="options"
              :props="props"
              expandTrigger="hover"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" v-for="(item1,indx) in item.attr_vals" :key="indx" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="uploadSuccess"
            :headers="header"
            list-type="picture" >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
          <el-button type="primary" @click="confirmAddGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="showPreviewImg"
      width="30%">
      <img :src="previeImgPath" alt="" class="previeImg">
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  getParamsById,
  addGoods
} from '../../network/goods'
import _ from 'lodash'

export default {
  name: 'AddGoods',
  data(){
    return {
      activeStep: 0,
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      addGoodsFormRules: {
        goods_name:[
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goods_price:[
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goods_number:[
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        goods_weight:[
          {required: true, message: '请输入商品重量', trigger: 'blur'}
        ],
        goods_cat:[
          {required: true, message: '请选择商品分类', trigger: 'blur'}
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      onlyData:[],
      manyData:[],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      header: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previeImgPath: '',
      showPreviewImg: false
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    handleChange() {
      if(this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = [];
      }
    },
    handlePreview(file){
      this.previeImgPath = file.response.data.url;
      this.showPreviewImg = true;
    },
    handleRemove(file,fileList){
      const index = this.addGoodsForm.pics.indexOf(file.response.data.pic);
      this.addGoodsForm.pics.splice(index,1);
    },
    uploadSuccess(response, file, fileList){
      console.log(response);
      const picInfo = {pic: response.data.tmp_path}
      this.addGoodsForm.pics.push(picInfo);
    },
    getCateList(){
      getCategoryList().then(res=>{
        console.log(res);
        if(res.meta.status == 200) {
          this.options = res.data;
          this.$message.success('获取分类成功');
        }else {
          this.$message.error('获取分类失败');
        }
      });
    },
    tableClicked(){
      if(this.activeStep === '1'){//获取动态参数
        getParamsById(this.cateId,'many').then(res=>{
          if(res.meta.status == 200) {
            res.data && res.data.forEach(item=>{
              item.attr_vals = item.attr_vals? item.attr_vals.split(','):[]
            });
            this.manyData = res.data;
            this.$message.success('获取参数成功');
          }else {
            this.$message.error('获取参数失败');
          }
        });
      }else if(this.activeStep === '2'){//获取静态属性
        getParamsById(this.cateId, 'only').then(res=>{
          if(res.meta.status == 200) {
            this.onlyData = res.data;
            this.$message.success('获取属性成功');
          }else {
            this.$message.error('获取属性失败');
          }
        });
      }
    },
    beforeLeave(newTabName,oldTabName){
      if (oldTabName === '0'){
        if(this.addGoodsForm.goods_cat.length !== 3){
          this.$message.error('请选择商品分类');
          return false;
        }else{
          return true;
        }
      }
    },
    confirmAddGoods(){
      this.$refs.addGoodsRef.validate(valid=>{
        if(!valid) return;
        const commitForm = _.cloneDeep(this.addGoodsForm);
        commitForm.goods_cat = commitForm.goods_cat.join(',');
        this.manyData.forEach(item=>{
          let tempObj = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
          this.addGoodsForm.attrs.push(tempObj);
        });
        this.onlyData.forEach(item=>{
          let tempObj = {attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addGoodsForm.attrs.push(tempObj);
        });
        commitForm.attrs = this.addGoodsForm.attrs;
        addGoods(commitForm).then(res=>{
          if(res.meta.status == 201){
            this.$message.success('添加商品成功');
            this.$router.push('/goods');
          }else{
            this.$message.error('添加商品失败');
          }
        });
      });
    }
  },
  computed: {
    cateId(){
      if(this.addGoodsForm.goods_cat.length === 3){
        return this.addGoodsForm.goods_cat[2];
      }
      return null;
    }
  }
}
</script>

<style lang="scss" scoped>
.addgoods {

  .el-steps {
    margin-top: 20px;
  }

  .el-tabs {
    margin-top: 20px;
  }

  .el-checkbox {
    margin: 0 10px 0 0;
  }

  .previeImg {
    width: 100%;
  }
  .el-button {
    margin-top: 20px;
  }
}
</style>