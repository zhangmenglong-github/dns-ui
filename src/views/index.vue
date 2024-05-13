<template>
  <div class="container">
    <el-container>
      <el-header class="header">
        <el-row class="header-wrapper">
          <el-row class="header-content">

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
      .header-content{
        width: 1280px;
      }
    }
  }
}
</style>

