<template>
  <div class="rolelist">
    <el-card>
      <el-row>
        <el-button type="primary" @click="addRoleAction">添加角色</el-button>
      </el-row>

      <el-table
    :data="roleData"
    border
    style="width: 100%"
    class="role-list-table">
    <el-table-column width="50" align="center" type="expand">
      <template slot-scope="scope">
        <el-row :class="['bdbottom',index ===0? 'bdtop':'','vcenter']" v-for="(item,index) in scope.row.children" :key="item.id">
          <el-col :span="5">
            <el-tag closable @close="removeRightTagById(scope.row, item.id)">{{item.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <el-col :span="19">
            <el-row :class="[index1===0? '':'bdtop','vcenter']" v-for="(item1,index1) in item.children" :key="item1.id">
              <el-col :span="6">
                <el-tag closable @close="removeRightTagById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-tag closable v-for="item2 in item1.children" :key="item2.id" @close="removeRightTagById(scope.row, item2.id)">{{item2.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column
      type="index"
      label="序号"
      width="60"
      align="center">
    </el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称"
      align="center">
    </el-table-column>
    <el-table-column
      prop="roleDesc"
      label="角色描述"
      align="center">
    </el-table-column>
    <el-table-column
      label="操作"
      align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRoleAction(scope.row.id)">编辑</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoleAction(scope.row.id)">删除</el-button>
        <el-button type="warning" size="mini" icon="el-icon-setting" @click="allotRightAction(scope.row)">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-card>

    <el-dialog
  title="添加角色"
  :visible.sync="showAddRole"
  width="50%" @close="closeAddRole(1)">

  <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="addRoleForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="addRoleForm.roleDesc"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showAddRole = false">取 消</el-button>
    <el-button type="primary" @click="comfirmAddRole(1)">确 定</el-button>
  </span>
</el-dialog>


<el-dialog
  title="编辑角色"
  :visible.sync="showEditRole"
  width="50%" @close="closeAddRole(2)">

  <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="100px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="editRoleForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="editRoleForm.roleDesc"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showEditRole = false">取 消</el-button>
    <el-button type="primary" @click="comfirmAddRole(2)">确 定</el-button>
  </span>
</el-dialog>

    <el-dialog
  title="分配权限"
  :visible.sync="showAllotRight"
  width="30%" @close="allotRightClosed">
    <el-tree 
    :data="rightData" 
    :props="rightProps" 
    show-checkbox
    node-key="id"
    default-expand-all
    :default-checked-keys="checkedRights"
    ref="allotRightRef"
    ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showAllotRight = false">取 消</el-button>
    <el-button type="primary" @click="comfirmAllotRight">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  getRoleById,
  editRole,
  deleteRole,
  deleteRightByRoleId,
  getRoleRightByType,
  allotRightByRoleId
} from '../../network/power'

export default {
  name: 'RoleList',
  data() {
    return {
      showAddRole: false,
      showEditRole: false,
      showAllotRight: false,
      roleData: [],
      addRoleForm: {
        roleName:'',
        roleDesc:''
      },
      addRoleFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: false, message: '请输入角色描述', trigger: 'blur'}
        ]
      },
      editRoleForm: {
        roleName:'',
        roleDesc:''
      },
      editRoleFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: false, message: '请输入角色描述', trigger: 'blur'}
        ]
      },
      rightData: [],
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      checkedRights: [],
      roleId: ''
    }
  },
  created() {
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      getRoleList().then(res => {
        if(res.meta.status == 200) {
          this.roleData = res.data;
        }
      });
    },
    editRoleAction (id) {
      this.showEditRole = true;
      getRoleById(id).then(res=>{
        if(res.meta.status == 200) {
          this.editRoleForm = res.data;
        }else {
          this.$message.error('获取角色信息失败');
        }
      });
    },
    deleteRoleAction (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole (id).then (res =>{
            if(res.meta.status == 200) {
              this.getRoleList();
              this.$message.success(res.meta.msg);
            }else {
              this.$message.success('删除失败');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    allotRightAction (role) {
      this.roleId = role.id;
      getRoleRightByType ('tree').then (res => {
        if(res.meta.status == 200) {
          this.rightData = res.data;
          this.getCheckedKey(role, this.checkedRights);
          console.log(this.checkedRights);
          this.showAllotRight = true;
        }else {
          this.$message.error('获取权限失败');
        }
      });
    },
    getCheckedKey(node, arr) {
      if(!node.children) return arr.push(node.id);
      node.children.forEach(item => this.getCheckedKey(item,arr));
    },
    closeAddRole (type) {
      if(type === 1) {
        this.$refs.addRoleFormRef.resetFields();
      }
      else {
        this.$refs.editRoleFormRef.resetFields();
      }
    },
    addRoleAction () {
      this.showAddRole = true;
    },
    comfirmAddRole (type) {
      //type===1添加角色
      if(type === 1) {
        this.$refs.addRoleFormRef.validate(valid=>{
        if(!valid) return;
        addRole(this.addRoleForm).then(res=>{
          if(res.meta.status == 201) {
            this.$message.success(res.meta.msg);
            this.getRoleList();
            this.showAddRole = false;
          }else {
            this.$message.error(res.meta.msg);
          }
        });
      });
      }else {//type===2编辑角色
        this.$refs.editRoleFormRef.validate(valid=> {
          if(!valid) return;
          editRole (this.editRoleForm).then(res=>{
            if(res.meta.status == 200) {
              this.getRoleList();
              this.$message.success(res.meta.msg);
              this.showEditRole = false;
            }else {
              this.$message.error('编辑角色失败');
            }
          });
        });
      } 
    },
    removeRightTagById(data, id) {
      console.log(this.roleData);
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRightByRoleId (data.id,id).then(res => {
            if(res.meta.status == 200) {
              data.children = res.data;
              this.$message.success(res.meta.msg);
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
    allotRightClosed () {
      this.checkedRights = [];
    },
    comfirmAllotRight () {
      const nodeIds = [
        ...this.$refs.allotRightRef.getCheckedKeys(),
        ...this.$refs.allotRightRef.getHalfCheckedKeys()
      ];
      const param = {'rids':nodeIds.join(',')};
      allotRightByRoleId(this.roleId,param).then(res=>{
        if(res.meta.status == 200) {
          this.getRoleList();
          this.$message.success('分配权限成功');
          this.showAllotRight = false;
        }else {
          this.$message.error(res.meta.msg);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.role-list-table {
  margin-top: 20px;

  .el-tag {
    margin: 7px;
  }
}

.bdbottom {
    border-bottom: 1px solid #eee;
  }

.bdtop {
  border-top: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>