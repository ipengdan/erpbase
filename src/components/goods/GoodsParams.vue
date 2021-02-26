<template>
  <div class="goodsparam">
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon>
      </el-alert>

      <el-row>
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectValue"
            :options="options"
            :props="props"
            expandTrigger="hover"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="selectTabName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="canAddParam" size="mini" @click="addDynamicAttr">添加参数</el-button>

          <el-table
            :data="manyData"
            border
            style="width: 100%">
            <el-table-column
            type="expand">
            <template slot-scope="spe">
              <el-tag closable v-for="(item,idx) in spe.row.attr_vals" :key="idx" @close="closeParamTag(idx,spe.row)">{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="spe.row.inputVisible"
                v-model="spe.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(spe.row)"
                @blur="handleInputConfirm(spe.row)">
              </el-input>
              <el-button v-else size="small" @click="showInput(spe.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
            <el-table-column
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="参数名称">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :enterable="false" content="编辑" placement="top">
                <el-button type="primary" @click="editParam(scope.row)">编辑</el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :enterable="false" content="删除" placement="top">
                <el-button type="danger" @click="deleteParam(scope.row)">删除</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">

          <el-button type="primary" :disabled="canAddParam" size="mini" @click="addStaticAttr">添加属性</el-button>

          <el-table
            :data="onlyData"
            border
            style="width: 100%">
            <el-table-column
            type="expand">
            <template slot-scope="spe">
              <el-tag closable v-for="(item,idx) in spe.row.attr_vals" :key="idx" @close="closeParamTag(idx,spe.row)">{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="spe.row.inputVisible"
                v-model="spe.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(spe.row)"
                @blur="handleInputConfirm(spe.row)">
              </el-input>
              <el-button v-else size="small" @click="showInput(spe.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
            <el-table-column
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="参数名称">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :enterable="false" content="编辑" placement="top">
                <el-button type="primary" @click="editParam(scope.row)">编辑</el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :enterable="false" content="删除" placement="top">
                <el-button type="danger" @click="deleteParam(scope.row)">删除</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
  :title="'添加'+attrName"
  :visible.sync="showAddDialog"
  width="50%" @close="closeAddParamDialog">
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
    <el-form-item :label="attrName" prop="attr_name">
      <el-input v-model="addForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showAddDialog = false">取 消</el-button>
    <el-button type="primary" @click="comfirmAddParam">确 定</el-button>
  </span>
</el-dialog>

  <el-dialog
  :title="'编辑'+attrName"
  :visible.sync="showEditDialog"
  width="50%" @close="closeEditParamDialog">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
    <el-form-item label="当前参数">
      <el-input disabled v-model="editForm.attr_name"></el-input>
    </el-form-item>
    <el-form-item :label="attrName" prop="attr_name">
      <el-input v-model="addForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showEditDialog = false">取 消</el-button>
    <el-button type="primary" @click="comfirmEditParam">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  getParamsById,
  addParam,
  deleteParam,
  editParam,
  getParamById,
  deleteValueFromParam
} from '../../network/goods'

export default {
  name: 'GoodsParams',
  data() {
    return {
      selectValue: [],
      options:[],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectTabName: 'many',
      manyData:[],
      onlyData:[],
      showAddDialog: false,
      addForm: {
        attr_name:''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      showEditDialog:false,
      editForm: {
        attr_name:''
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      getCategoryList().then(res=>{
        if(res.meta.status == 200){
          this.options = res.data;
          this.$message.success('获取分类列表成功');
        }else {
          this.$message.error('获取分类列表失败');
        }
      });
    },
    handleChange(){
      //只能选择第三级分类
      if(this.selectValue.length !== 3) {
        this.selectValue = [];
        this.manyData = [];
        this.onlyData = [];
        this.$message.error('只能选择第三级分类');
        return;
      }
      this.getParams();
    },
    handleClick(tab, event){
      this.selectTabName = tab.name;
      this.getParams();
    },
    getParams(){
      let tempid = this.getCateId;
      getParamsById(tempid, this.selectTabName).then(res=>{
        if(res.meta.status == 200) {
          res.data && res.data.forEach(item=>{
            item.attr_vals = item.attr_vals? item.attr_vals.split(','):[];
            item.inputVisible = false;
            item.inputValue = '';
          });
          if(this.selectTabName == 'many') {
            this.manyData = res.data;
          }else {
            this.onlyData = res.data;
          }
        }else {
          this.$message.error('获取参数失败');
        }
      });
    },
    closeAddParamDialog(){
      this.$refs.addFormRef.resetFields();
    },
    closeEditParamDialog(){
      this.$refs.editFormRef.resetFields();
    },
    addDynamicAttr(){
      this.showAddDialog = true;
    },
    addStaticAttr(){
      this.showAddDialog = true;
    },
    comfirmAddParam(){
      const tempId = this.getCateId;
      addParam(tempId,this.addForm.attr_name,this.selectTabName).then(res=>{
        if(res.meta.status == 201){
          this.$message.success('添加成功');
          this.getParams();
          this.showAddDialog = false;
        }else {
          this.$message.error('添加失败');
        }
      });
    },
    comfirmEditParam(){
      const tempId = this.getCateId;
      editParam(tempId,this.editForm.attr_id,this.editForm.attr_name,this.selectTabName).then(res=>{
        if(res.meta.status == 200){
          this.$message.success('编辑成功');
          this.getParams();
          this.showEditDialog = false;
        }else {
          this.$message.error('编辑失败');
        }
      });
    },
    editParam(row){
      getParamById(row.cat_id,row.attr_id,this.selectTabName).then(res=>{
        if(res.meta.status == 200) {
          this.editForm = res.data;
          this.showEditDialog = true;
          this.$message.success('获取参数成功');
        }else {
          this.$message.error('获取参数失败');
        }
      });
    },
    deleteParam(row){
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteParam(row.cat_id,row.attr_id).then(res=>{
            if(res.meta.status == 200) {
              this.$message.success('删除成功');
              this.getParams();
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
    closeParamTag(index,row) {
      row.attr_vals.splice(index,1);
      this.saveAttr(row);
    },
    saveAttr (row) {
      deleteValueFromParam(row.cat_id,row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join(' ')).then(res=>{
        if(res.meta.status == 200) {
          this.$message.success('删除成功');
        }else {
          this.$message.error('删除失败');
        }
      });
    },
    handleInputConfirm(row){
      if(row.inputValue.trim().length === 0) {
        return;
      }
      row.attr_vals.push(row.inputValue);
      row.inputValue = '';
      this.saveAttr(row);
      row.inputVisible = false
    },
    showInput(row){
      row.inputVisible = true;
      this.$nextTick(()=>{
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  computed: {
    canAddParam () {
      if(this.selectValue.length !== 0) {
        return false;
      }
      return true;
    },
    getCateId() {
      if(this.selectValue.length !== 0) {
        return this.selectValue[2];
      }
      return null;
    },
    attrName() {
      if(this.selectTabName == 'many') {
        return '动态参数';
      }else {
        return '静态属性';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goodsparam {

  .el-alert{
    margin-bottom: 20px;
  }
  .el-tabs {
    margin-top: 20px;

    .el-button {
      margin-bottom: 20px;
    }
    .el-tag {
      margin-right: 10px;
    }

    .input-new-tag {
      width: 120px;
    }
  }
}
</style>