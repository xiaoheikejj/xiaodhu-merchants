<template>
    <div class="wrapper">
        <Header></Header>
        <div class="layout">
            <Sidebar></Sidebar>
            <div class="main">
                <transition name="move" mode="out-in"><router-view></router-view></transition>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from './Header';
    import Sidebar from './Sidebar';
    export default {
        components:{
            Header, 
            Sidebar
        }
    }
</script>

<style lang="scss" scoped>
    .wrapper{
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .layout{
        flex: 1;
        display: flex;
        background-color: #f0f2f5;
    }
    .header{
        // background-color: #313540;
        background-color: rgb(70, 76, 91);
    }
    .main{
        flex: 1;
        background-color: #f0f2f5;
        display: flex;
        overflow-y: auto;
    }
</style> 
