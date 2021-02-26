<template>
  <div class="school-mgr">
    <el-button type="primary" size="mini" @click="saveSetting"
      >保存设置</el-button
    >

    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-success="handleVideoSuccess"
      :before-upload="beforeUploadVideo"
      :on-change="AvatarAUDIO"
      v-bind:on-progress="uploadVideoProcess"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <el-drawer title="我是标题" :visible.sync="drawer" :direction="rtl">
      <phone-monitor />
    </el-drawer>

    <el-tree
      :props="props"
      lazy
      show-checkbox
      @check-change="handleCheckChange"
      @node-click="nodeClicked"
    >
    </el-tree>
  </div>
</template>

<script>
import { getPlatforms } from "../../../network/platform";
import PhoneMonitor from "./PhoneMonitor.vue";
export default {
  components: { PhoneMonitor },
  data() {
    return {
      props:{
        label: 'departmentName',
        children: 'depts'
      },
      drawer: false,
      fileList: [],
      phoneIcon:
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2059503356,118138284&fm=15&gp=0.jpg",
      companyList: [
        {
          chargeName: '小明',
          chargePhone: '15556799765',
          companyId: 1,
          companyName: '清华大学',
          companyState: 1,
          endTime: '2012-21-21',
          startTime: '2020-12-12'
        },
        {
          chargeName: '小黑',
          chargePhone: '15556799765',
          companyId: 2,
          companyName: '测试公司',
          companyState: 1,
          endTime: '2012-21-21',
          startTime: '2020-12-12'
        }
      ],
      departmentList:[
        {
          
        },
        {}
      ]
    };
  },
  created() {
    this.getPlatforms();
  },
  methods: {
    getPlatforms() {
      getPlatforms().then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.schoolList = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    saveSetting() {
      this.drawer = true;
    },
    handlePreview(file) {
      console.log("pre");
      console.log(file);
    },
    beforeUploadVideo() {},
    handleVideoSuccess(res, file) {
      console.log("ddlkklgdl");
      console.log(res);
      console.log(file);
    },
    AvatarAUDIO(file, filelist) {
      console.log("change");
      console.log(file);
      console.log(filelist);
    },
    uploadVideoProcess(event, file, fileList) {
      console.log("process");
      console.log(event);
      console.log(file);
      console.log(fileList);
    },
    nodeClicked(data){
      console.log(data);
    },
    handleCheckChange(data){
      console.log(data);
    }
  },
};
</script>

<style lang="scss" scoped>
.school-mgr {
  .phone-area {
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>