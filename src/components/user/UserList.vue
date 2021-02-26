<template>
  <div class="user-list">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="clearAction">
            <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddUser = true">添加用户</el-button>
        </el-col>
    </el-row>

    <el-table
    :data="userData"
    border
    style="width: 100%">
    <el-table-column
      align="center"
      label="序号"
      type="index">
    </el-table-column>
    <el-table-column
      align="center"
      prop="username"
      label="用户名">
    </el-table-column>
    <el-table-column
      align="center"
      prop="role_name"
      label="用户角色">
    </el-table-column>
    <el-table-column
      align="center"
      prop="mobile"
      label="联系电话">
    </el-table-column>
    <el-table-column
      align="center"
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      align="center"
      prop="mg_state"
      label="状态">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      label="操作"
      width="180">
      <template slot-scope="scope">
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editorUserAction(scope.row.id)"></el-button>
        </el-tooltip>

        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUserAction(scope.row.id)"></el-button>
        </el-tooltip>

        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" size="mini" icon="el-icon-setting" @click="allotRoleAction(scope.row)"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="showAddUser"
      width="50%" @close="closeAddUserPanel">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUsersAction">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户信息"
      :visible.sync="showEditorUser"
      width="50%" @close="closeEditUserPanel">
        <el-form :model="editorUserForm" :rules="editorUserFormRules" ref="editorUserFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editorUserForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editorUserForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editorUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showEditorUser = false">取 消</el-button>
      <el-button type="primary" @click="comfirmEditorUserAction">确 定</el-button>
    </span>
    </el-dialog>

    <el-dialog
  title="分配角色"
  :visible.sync="showAllotRole"
  width="50%" @close="closeAllotDialog">
  <div>
    <p>当前用户: {{currentAllotUser.username}}</p>
    <p>当前角色: {{currentAllotUser.role_name}}</p>
    <p>选择要分配的角色: 
      <el-select v-model="currentSelectRole" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showAllotRole = false">取 消</el-button>
    <el-button type="primary" @click="comfirmAllotRole">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import {
  getUsers, 
  editUserState, 
  addUser,
  editUserInfo,
  queryUserInfoById,
  deleteUser,
  allotRoleToUser
  } from '../../network/user'

import {getRoleList} from '../../network/power'

export default {
  name: 'UserList',
  data () {
    var checkEmail = (rule, value, cb)=> {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if(regEmail.test(value)) {
        return cb();
      }

      cb(new Error('请输入合法的邮箱'));
    }

    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if(regMobile.test(value)) {
        return cb();
      }

      cb(new Error('请输入合法的手机号'));
    }
    return {
      query: '',
      currentPage: 1,
      total: 0,
      pagesize: 10,
      userData: [],
      showAddUser: false,
      showEditorUser: false,
      showAllotRole: false,
      currentAllotUser: {},
      currentSelectRole: '',
      roleList: [],
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          {required:true, message: '请输入用户名', trigger:'blur'},
          {min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur'}
        ],
        password: [
          {required:true, message: '请输入密码', trigger:'blur'},
          {min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur'}
        ],
        email: [
          {required:true, message: '请输入邮箱', trigger:'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required:true, message: '请输入手机号', trigger:'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      editorUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: '',
      },
      editorUserFormRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers () {
      getUsers({'query':this.query,'pagenum':this.currentPage, 'pagesize':this.pagesize}).then (res => {
        if(res.meta.status == 200) {
          this.userData = res.data.users;
          this.total = res.data.total;
          this.$message.success(res.meta.msg);
        }
      });
    },
    addUsersAction () {
      this.$refs.addUserRef.validate(valid =>{
        if(!valid) return;
        addUser(this.addUserForm).then (res => {
          debugger
          if(res.meta.status == 201) {
            this.$message.success(res.meta.msg);
            this.showAddUser = false;
            this.getUsers();
          }else {
            this.$message.error(res.meta.msg);
          }
        });  
      });
    },
    handleSizeChange (size) {
      this.pagesize = size;
      this.getUsers();
    },
    handleCurrentChange (page) {
      this.currentPage = page;
      this.getUsers();
    },
    userStateChanged(row) {
      const param = {
        'uid':row.id,
        'state':row.mg_state
      };
      this.editUserState(param);
    },
    editUserState (userinfo) {
      editUserState (userinfo).then(res => {
        if(res.meta.status == 200) {
          this.$message.success(res.meta.msg);
        }else {
          userinfo.mg_state = !userinfo.mg_state;
          this.$message.error(res.meta.msg);
        }
      });
    },
    queryUser () {
      this.getUsers();
    },
    clearAction () {
      this.getUsers();
    },
    //关闭添加用户对话框的回调方法 清空表单数据
    closeAddUserPanel(){
      this.$refs.addUserRef.resetFields();
    },
    editorUserAction (id) {
      this.showEditorUser = true;
      queryUserInfoById (id).then (res => {
        if (res.meta.status == 200) {
          this.editorUserForm = res.data;
          this.$message.success(res.meta.msg);
        }else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    deleteUserAction (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser (id).then(res => {
            console.log(res+'------'+id);
            if(res.meta.status == 200) {
              this.getUsers();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    allotRoleAction (user) {
      this.currentAllotUser = user;
      getRoleList ().then(res => {
        if(res.meta.status == 200) {
          this.roleList = res.data;
          this.showAllotRole = true;
          this.$message.success('获取角色列表成功');
        }else {
          this.$message.error('获取角色列表失败');
        }
      });
    },
    comfirmEditorUserAction () {
      this.$refs.editorUserFormRef.validate (valid => {
        if (!valid) return;
        editUserInfo (this.editorUserForm.id, {'email': this.editorUserForm.email,'mobile': this.editorUserForm.mobile}).then(res => {
          if(res.meta.status == 200) {
            this.showEditorUser = false;
            this.getUsers();
            this.$message.success(res.meta.msg);
          }else {
            this.$message.error(res.meta.msg);
          }
        });
      });
    },
    closeEditUserPanel () {
      this.$refs.editorUserFormRef.resetFields();
    },
    closeAllotDialog () {
      this.currentAllotUser = {};
      this.currentSelectRole = '';
    },
    comfirmAllotRole () {
      allotRoleToUser (this.currentAllotUser.id, this.currentSelectRole).then(res=> {
        if (res.meta.status == 200) {
          this.showAllotRole = false;
          this.getUsers();
          this.$message.success('角色更新成功');
        }else {
          this.$message.error(res.meta.msg);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list {

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }

  .el-table {
    margin-top: 20px;
  }

  .el-pagination {
    margin-top: 10px;
  }
}
</style>