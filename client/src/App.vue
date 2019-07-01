<template>
  <div id="app">
    <navbar v-show="$store.state.logRegStatus.loggedIn"/>
    <router-view id="content-wrap"/>
    <footers id="footer" v-show="$store.state.logRegStatus.loggedIn" class="mt-4"/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footers from '@/components/Footer.vue';

export default {
  components: {
    Navbar,
    Footers,
  },
  created() {
    this.$store.dispatch('checkLogin')
  },
};
</script>

<style>
body {
  padding-top: 100px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#app {
  position: relative;
  min-height: 100vh;
}

#content-wrap {
  padding-bottom: 150px;    /* Footer height */
}

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;            /* Footer height */
}
</style>
