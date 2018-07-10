<template>
    <el-container id="home" style="flex-direction: row;">
        <el-aside style="width: auto;">
            <Sidebar></Sidebar>
        </el-aside>
        <el-container class="layout" style="flex-direction: column">
            <Header></Header>
            <el-main class="main">
                <transition name="move" mode="out-in"><router-view></router-view></transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../assets/sideBarIcon/iconfont.css"
export default {
  components: {
    Header,
    Sidebar
  }
};
</script>
<style lang="scss">
$asideBg: #344058;
    #home {
        .el-aside {
            background-color: $asideBg;
        }
        #Header {
            background-color: #fff;
            border: 1px solid #f2f2f2;
            .iconfont {
                font-size: 28px;
            }
        }
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 200px;
        }
        .el-main {
            padding: 0;
        }
    }
</style>
