<template>
  <div class="config">
      <!-- <router-link to="/">Home</router-link> -->
      <div></div>
      <div class="config-details">          
        <config-server  v-for="server in servers" v-bind:key="server.id" :server="server" :connect="false"></config-server>
      </div>
      <!-- <span v-on:click="addServer" class="pointer underline">Add</span> -->

      <md-button v-on:click="addServer" class="md-fab md-primary md-fab-bottom-right">
        <md-icon>add</md-icon>
      </md-button>   
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ConfigServer from "./ConfigServer.vue";

export default {
  name: "Config",
  components: {
    ConfigServer
  },
  methods: {
    addServer: async function() {
      let server = await this.$store.dispatch("addServer");
    }
  },
  props: {},
  computed: {
    ...mapGetters({
      servers: "servers"
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
.pointer {
  cursor: pointer;
}

.underline {
  text-decoration: underline;
}

.config-details {
    display: grid;
    margin: 20px;
    grid-template-columns: repeat( auto-fit, minmax(300px, 300px) );
    grid-gap: 10px 15px;
    
}

</style>
