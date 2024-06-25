<template>
  <el-row class="container">
    <el-col :span="2" class="el-col"></el-col>
    <el-col class="hidden-xs-only pc" :span="20">
      <el-row class="header">
        <el-col :span="4">
          <strong class="logo">DNS云解析官网</strong>
        </el-col>
        <el-col :span="11">
          <el-row class="nav-bar">
            <el-col :span="4">
              <el-link :underline="false" class="link">主页</el-link>
            </el-col>
            <el-col :span="5">
              <el-link :underline="false" class="link">关于我们</el-link>
            </el-col>
            <el-col :span="4">
              <el-link :underline="false" class="link">产品</el-link>
            </el-col>
            <el-col :span="5">
              <el-link :underline="false" class="link">帮助中心</el-link>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="9">
          <el-row>
            <el-col :span="12">
              <div class="search-input-wrapper">
                <el-input
                  class="search-input"
                  placeholder="搜索"
                  prefix-icon="el-icon-search">
                </el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div @click="register" class="register-button">注册</div>
            </el-col>
            <el-col :span="6">
              <div @click="login" class="login-button">登录</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="banner">
        <el-col :span="12" class="product-introduction">
          <div class="introduction-wrapper">
            <strong class="title-text">DNS云解析</strong>
            <p class="introduction-text">DNS云解析是一种通过云服务提供商提供的域名解析服务，可以将域名解析到指定的IP地址，实现域名访问的映射。</p>
            <div class="login-register-wrapper">
              <div @click="register" class="register-button">注册</div>
              <div @click="login" class="login-button">登录</div>
            </div>
          </div>

        </el-col>
        <el-col :span="12" class="lottie-animation">
          <div id="lottie-pc"></div>
        </el-col>
        <div class="banner-background"></div>
      </el-row>
    </el-col>
    <el-col class="hidden-sm-and-up mobile" :span="20">
      <el-row class="header">
        <el-col :span="24">
          <strong class="logo">DNS云解析官网</strong>
        </el-col>
      </el-row>
      <el-row class="banner">
        <el-row class="wrapper">
          <el-col :span="24" class="lottie-animation">
            <div id="lottie-mobile"></div>
          </el-col>
        </el-row>
        <el-row class="wrapper">
          <el-col :span="24" class="product-introduction">
            <div class="introduction-wrapper">
              <strong class="title-text">DNS云解析</strong>
              <p class="introduction-text">DNS云解析是一种通过云服务提供商提供的域名解析服务，可以将域名解析到指定的IP地址，实现域名访问的映射。</p>
              <div class="login-register-wrapper">
                <div @click="register" class="register-button">注册</div>
                <div @click="login" class="login-button">登录</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="banner-background"></div>
      </el-row>
    </el-col>
    <el-col :span="2" class="el-col"></el-col>
  </el-row>
</template>

<script>
import lottie from 'lottie-web';
import 'element-ui/lib/theme-chalk/display.css';
export default {
  name: "Index",
  data() {
    return {
    };
  },
  mounted() {
    this.loadAnimation();
  },
  methods: {
    register() {
      this.$router.push("/register");
    },
    login() {
      this.$router.push("/login")
    },
    loadAnimation() {
      lottie.loadAnimation({
        container: document.getElementById('lottie-pc'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie/lottie.json' // 动画JSON文件的路径
      });
      lottie.loadAnimation({
        container: document.getElementById('lottie-mobile'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie/lottie.json' // 动画JSON文件的路径
      });
    }
  }
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'Kalam-Bold';
  src: url('../assets/fonts/Kalam-Bold.woff2') format('woff2')
}
.el-col{
  border: 1px solid transparent;
}
.container{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: rgba(29, 33, 41, 1);
  overflow-x: hidden;
  .pc{
    min-width: 1280px;
    .header{
      width: 100%;
      height: 72px;
      display: flex;
      align-items: center;
      .logo{
        font-size: 24px;
        font-weight: bold;
        font-family: "Kalam-Bold";
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
      }
      .nav-bar{
        padding-left: 150px;
        .link{
          font-size: 15px;
          color: rgba(255, 255, 255, 1);
          cursor: pointer;
        }
      }
      .search-input-wrapper{
        left: 0;
        top: 0;
        width: 200px;
        height: 40px;
        opacity: 1;
        border-radius: 292px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 8px 16px 8px 16px;
        .search-input{
          ::v-deep .el-input__inner{
            background-color: transparent !important;
            border: none;
          }
        }
      }
      .register-button{
        left: 0;
        top: 0;
        width: 74px;
        height: 40px;
        opacity: 1;
        border-radius: 40px;
        background: rgba(30, 30, 30, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px 0 20px;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
      }
      .login-button{
        left: 0;
        top: 0;
        width: 74px;
        height: 40px;
        opacity: 1;
        border-radius: 40px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px 0 20px;
        color: rgba(255, 255, 255, 1);
        border: 1px solid rgba(255, 255, 255, 0.16);
        cursor: pointer;
      }
    }
    .banner{
      width: 100%;
      height: 760px;
      display: flex;
      align-items: center;
      position: relative;
      .product-introduction{
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .introduction-wrapper{
          width: 520px;
          height: 238px;
          opacity: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .title-text{
            font-size: 44px;
            font-weight: 700;
            letter-spacing: 0;
            line-height: 66px;
            color: rgba(255, 255, 255, 1);
            text-align: left;
            vertical-align: top;
          }
          .introduction-text{
            font-size: 18px;
            font-weight: 400;
            letter-spacing: 0;
            line-height: 28px;
            color: rgba(255, 255, 255, 1);
            text-align: left;
            vertical-align: top;
          }
          .login-register-wrapper{
            width: 208px;
            height: 68px;
            opacity: 1;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 16px 0 0 0;
            .register-button{
              left: 0;
              top: 0;
              width: 74px;
              height: 40px;
              opacity: 1;
              border-radius: 40px;
              background: rgba(30, 30, 30, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 20px 0 20px;
              color: rgba(255, 255, 255, 1);
              cursor: pointer;
            }
            .login-button{
              margin-left: 20px;
              width: 74px;
              height: 40px;
              opacity: 1;
              border-radius: 40px;
              background: rgba(255, 255, 255, 0.08);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 20px 0 20px;
              color: rgba(255, 255, 255, 1);
              border: 1px solid rgba(255, 255, 255, 0.16);
              cursor: pointer;
            }
          }
        }
      }
      .lottie-animation{
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        #lottie-pc{
          width: 600px;
          height: 600px;
        }
      }
      .banner-background{
        z-index: 0;
        position: absolute;
        width: 734.76px;
        height: 435.63px;
        opacity: 1;
        transform: rotate(37.57deg);
        background: linear-gradient(90deg, rgba(240, 0, 240, 0.1) 0%, rgba(0, 128, 255, 0.1) 45.84%, rgba(21, 0, 255, 0.1) 100%);
        filter: blur(100px);
        display: flex;
      }
    }
  }
  .mobile{
    .header{
      width: 100%;
      height: 72px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo{
        display: block;
        font-size: 24px;
        font-weight: bold;
        font-family: "Kalam-Bold";
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        text-align: center;
      }
    }
    .banner{
      width: 100%;
      height: 600px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      .wrapper{
        width: 100%;
        .product-introduction{
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .introduction-wrapper{
            width: 520px;
            height: 238px;
            opacity: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .title-text{
              font-size: 44px;
              font-weight: 700;
              letter-spacing: 0;
              line-height: 66px;
              color: rgba(255, 255, 255, 1);
              text-align: left;
              vertical-align: top;
            }
            .introduction-text{
              font-size: 18px;
              font-weight: 400;
              letter-spacing: 0;
              line-height: 28px;
              color: rgba(255, 255, 255, 1);
              text-align: left;
              vertical-align: top;
            }
            .login-register-wrapper{
              width: 208px;
              height: 68px;
              opacity: 1;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              padding: 16px 0 0 0;
              .register-button{
                left: 0;
                top: 0;
                width: 74px;
                height: 40px;
                opacity: 1;
                border-radius: 40px;
                background: rgba(30, 30, 30, 1);
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 20px 0 20px;
                color: rgba(255, 255, 255, 1);
                cursor: pointer;
              }
              .login-button{
                margin-left: 20px;
                width: 74px;
                height: 40px;
                opacity: 1;
                border-radius: 40px;
                background: rgba(255, 255, 255, 0.08);
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 20px 0 20px;
                color: rgba(255, 255, 255, 1);
                border: 1px solid rgba(255, 255, 255, 0.16);
                cursor: pointer;
              }
            }
          }
        }
        .lottie-animation{
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          #lottie-mobile{
            width: 300px;
            height: 300px;
          }
        }
      }
      .banner-background{
        z-index: 0;
        position: absolute;
        width: 734.76px;
        height: 435.63px;
        opacity: 1;
        transform: rotate(37.57deg);
        background: linear-gradient(90deg, rgba(240, 0, 240, 0.1) 0%, rgba(0, 128, 255, 0.1) 45.84%, rgba(21, 0, 255, 0.1) 100%);
        filter: blur(100px);
        display: flex;
      }
    }
  }
}
</style>

