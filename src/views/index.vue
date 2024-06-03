<template>
  <div class="container">
    <el-container>
      <el-header class="header">
        <el-row class="header-wrapper">
          <el-row class="header-content">
            <el-col class="header-title" :span="4">
              <strong>DNS云解析官网</strong>
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </el-row>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'momo';
  src: url('../assets/fonts/momo.woff2') format('woff2')
}
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #1D2129;
  .header{
    padding: 0;
    margin: 0;
    .header-wrapper{
      width: 100%;
      height: 72px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: yellow;
      .header-content{
        width: 1280px;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: red;
        .header-title{
          font-size: 22px;
          font-weight: bold;
          font-family: "momo";
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>

