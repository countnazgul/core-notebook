<template>
  <div id="app">

    <main-header></main-header>
    <router-view />

  </div>
</template>
<script>
import { mapGetters } from "vuex";
import MainHeader from "./components/Header.vue";

export default {
  name: "Main",
  components: {
    MainHeader
  },
  beforeCreate() {
    this.$store.commit("INIT_STORE");
  }
};
</script>
<style>
#app {
  font-family: "Hack", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  display: grid;
  grid-template-rows: 50px calc(100vh - 50px);
}

body {
  margin: 0px;
}

@font-face {
  font-family: "LUI icons";
  src: url(assets/lui-icons.woff) format("woff"),
    url(assets/lui-icons.ttf) format("truetype");
}

/* .test {
  margin: 10px;
} */
</style>
