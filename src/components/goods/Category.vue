<template>
  <div class="category">
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCategoryAction">添加分类</el-button>
      </el-row>

      <tree-table
      class="tree-table"
      :data="categoryList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="序号"
      border
      :show-row-hover="false"
      >
      <template slot="isOk" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="info" v-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
      </template>
      <template slot="option" slot-scope="scope">
        <el-tooltip effect="dark" :enterable="false" content="编辑" placement="top">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCategory(scope.row)">编辑</el-button>
        </el-tooltip>
        <el-tooltip effect="dark" :enterable="false" content="删除" placement="top">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategory(scope.row)">删除</el-button>
        </el-tooltip>
      </template>
      </tree-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <el-dialog
  title="添加分类"
  :visible.sync="showAddCategory"
  width="50%" @close="closeAddCategoryDialog">
  <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类">
      <el-cascader
        v-model="optionValue"
        :options="options"
        :props="optionProp"
        @change="selectCategory"
        expandTrigger="hover"
        clearable>
      </el-cascader>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showAddCategory = false">取 消</el-button>
    <el-button type="primary" @click="comfirmAddCategory">确 定</el-button>
  </span>
</el-dialog>

  <el-dialog
  title="编辑分类"
  :visible.sync="showEditCate"
  width="50%" @close="closeEditCategory">
  <el-form :model="editCateForm" :rules="editCateRules" ref="editCateRef" label-width="100px">
    <el-form-item label="当前类名">
      <el-input v-model="editCateForm.cat_name" disabled></el-input>
    </el-form-item>
    <el-form-item label="新类名" prop="cat_newName">
      <el-input v-model="editCateForm.cat_newName"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showEditCate = false">取 消</el-button>
    <el-button type="primary" @click="comfirmEditCategory">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  addCategory,
  editCategory,
  deleteCategory
  } from '../../network/goods'

export default {
  name: 'category',
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 0,
        pagesize: 5
      },
      options: [],
      optionValue:[],
      optionProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      total:0,
      categoryList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option',
          align: 'center',
          headerAlign: 'center'
        }
      ],
      showAddCategory: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules:{
        cat_name:[
          {required: true, message: '请输入分类名', trigger:'blur'},
          {min: 2, max: 8, message: '长度为2-8', trigger: 'blur'}
        ]
      },
      showEditCate: false,
      editCateForm: {
        cat_id: 0,
        cat_name: '',
        cat_newName: ''
      },
      editCateRules: {
        cat_newName:[
          {required: true, message: '请输入分类名', trigger:'blur'},
          {min: 2, max: 8, message: '长度为2-8', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      getCategoryList(this.querInfo).then(res=>{
        if(res.meta.status == 200) {
          console.log(res);
          this.categoryList = res.data.result;
          this.total = res.data.total;
          this.$message.success('获取分类成功');
        }else {
          this.$message.error('获取分类失败');
        }
      });
    },
    //获取一二级分类
    getCateListOneTwo(){
      getCategoryList({type:2}).then(res=>{
        if(res.meta.status == 200) {
          this.options = res.data;
          console.log(res);
          this.$message.success('获取一二分类成功');
        }else {
          this.$message.error('获取一二分类失败');
        }
      });
    },
    showAddCategoryAction() {
      this.getCateListOneTwo();
      this.showAddCategory = true;
    },
    handleSizeChange(value) {
      this.querInfo.pagesize = value;
      this.getCateList();
    },
    handleCurrentChange(value) {
      this.querInfo.pagenum = value;
      this.getCateList();
    },
    editCategory(row){
      console.log(row);
      this.editCateForm.cat_name = row.cat_name;
      this.editCateForm.cat_id = row.cat_id;
      this.showEditCate = true;
    },
    comfirmEditCategory() {
      this.$refs.editCateRef.validate(valid=>{
        if(!valid) return;
        editCategory(this.editCateForm).then(res=>{
          if(res.meta.status == 200){
            this.$message.success('编辑分类成功');
            this.showEditCate = false;
            this.getCateList();
          }else {
            this.$message.error('编辑分类失败');
          }
        });
      });
    },
    closeEditCategory(){
      this.$refs.editCateRef.resetFields();
    },
    deleteCategory(row){
      this.$confirm('此操作将永久删除该类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCategory(row.cat_id).then(res=>{
            if(res.meta.status == 200){
              this.$message.success('删除成功');
              this.getCateList();
            }else{
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
    selectCategory(){
      console.log(this.optionValue);
      if(this.optionValue.length > 0) {
        this.addCateForm.cat_pid = this.optionValue[this.optionValue.length - 1];
        this.addCateForm.cat_level = this.optionValue.length;
      }else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    comfirmAddCategory() {
      this.$refs.addCateRef.validate(valid=>{
        if(!valid) return;
        addCategory(this.addCateForm).then(res=>{
          if(res.meta.status == 201) {
            this.$message.success('添加分类成功');
            this.showAddCategory = false;
            this.getCateList();
          }else {
            this.$message.error('添加分类失败');
          }
        });
      });
    },
    closeAddCategoryDialog(){
      this.$refs.addCateRef.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.category {

  .tree-table {
    margin-top: 20px;
  }

  .el-pagination {
    margin-top: 20px;
  }
}
</style>