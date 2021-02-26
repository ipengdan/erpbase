<template>
  <div class="phone-monitor">
    <div class="back-img">
      <img :src="phoneIcon" alt="" />
    </div>
    <scroll class="content-scroll">
      <div class="content">
        <h3>大纲大萨达故事所感动公司规定</h3>
        <div class="author-date">
          <span>太空巡逻人</span>
          <span>2020-12-12</span>
        </div>
        <div class="main-txt"></div>
        <video
          src="../../../assets/video/11.mp4"
          :controls="true"
          
          style="width:100%;"

          ref="video"
        ></video>
      </div>
    </scroll>
  </div>
</template>

<script>
export default {
  name: "PhoneMonitor",
  props: {},
  data() {
    return {
      phoneIcon:
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2059503356,118138284&fm=15&gp=0.jpg",
    };
  },
  created() {},
  methods: {
    initVideo(){

    },
    play(player){},
    pause(player){},
    seeking(){}
  },
};
</script>

<style lang="scss" scoped>
.phone-monitor {
  .back-img {
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content-scroll {
    position: absolute;
    top: 24.5%;
    left: 19%;
    width: 60.5% !important;
    height: 70% !important;
    background-color: #fff;
    cursor: pointer;
    overflow: hidden;
    .content {
      width: 100%;
      height: 100%;
    }
  }
}
</style>