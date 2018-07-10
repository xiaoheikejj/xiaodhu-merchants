<template>
  <div id="LogReg">
    <transition name="move" mode="out-in"><router-view></router-view></transition>
  </div>
</template>

<script>
import Login from "./Login";
export default {
  name: "LogReg",
  components: {
    Login
  }
};
</script>

<style lang="scss">
#LogReg {
  flex: 1;
  height: 100%;
  background-color: #2d3a4b;
  position: relative;
}
</style>
