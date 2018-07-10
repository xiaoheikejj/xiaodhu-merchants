<template>
    <div class="sidebar">
        <el-menu default-active="1" class="el-menu-vertical-demo" router background-color="#2d3a4b" text-color="#bfcbd9" active-text-color="#20a0ff" :collapse="$store.state.isCollapse" :unique-opened="true">
            <div class="logo">
                <span>{{ $store.state.title }}</span>
            </div>
            <!-- <el-submenu index="888">
                <template slot="title">
                    <i class="iconfont icon-yemian"></i>
                    <span>主页</span>
                </template>
                 <template>
                     <el-menu-item-group>
                        <el-menu-item index="/index">主页一</el-menu-item>
                    </el-menu-item-group>
                 </template>
            </el-submenu> -->
            <template v-for="(item,index) in navList">
                <el-menu-item v-if="item.authUrl" :index="item.authUrl">
                    <span slot="title">{{item.authName}}</span>
                </el-menu-item>
                <el-submenu  v-else :index="String(index)">
                    <template slot="title">
                        <i :class="item.iconfont"></i>
                        <span>{{item.authName}}</span>
                    </template>
                     <template v-for="i in item.tblMerchantResource">
                         <el-menu-item-group>
                            <el-menu-item :index="i.authUrl">{{i.authName}}</el-menu-item>
                        </el-menu-item-group>
                     </template>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import {baseUrl,Ajax} from "../assets/api/api";
    export default {
        data() {
            return {
                isCollapse: false,
                navList:[],
            }
        },
        beforeCreate() {
            Ajax('/merchantSource/getMenuResource', 'post').then(res => {
                if(res.status == 0){
                    this.navList = res.dataInfo[0];
                }else if(res.status == 3){
                    this.$router.push("/login");
                }else{
                    this.$router.push("/login");
                }
            }).catch(err => {
                this.$router.push("/login");
            });
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    };
</script>

<style lang="scss">
    .sidebar {
        background-color: #324157;
        display: flex;
        flex-direction: column;
        &.collapse{
            width: 50px;
        }
        ul {
            flex: 1;
            border-right: 0;
        }
        .el-menu{
            // padding: 0 10px;
        }
        .el-menu-item{
            // width: 160px;
            // min-width: 160px;
            // max-width: 160px;
        }
        .el-submenu__title{
            background-color: #344058 !important;
            &>span{
                vertical-align: top;
            }
        }
        .el-submenu .el-menu-item{
            // width: 160px;
            // min-width: 160px;
            // max-width: 160px;
            padding-left: 30px !important;
        }
        .el-menu-item-group__title{
            display: none;
        }
        .el-submenu .el-menu-item.is-active {
            color: #fff!important;
            background-color: #4b9af5!important;
        }
    }
</style>
