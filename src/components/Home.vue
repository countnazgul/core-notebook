<template>
  <div class="hello">
      <div class="config-details">          
        <config-server  v-for="server in servers" 
        v-bind:key="server.id" 
        :server="server" 
        :connect="true" 
        @openConnection="openConnection"></config-server>
      </div>

      <!-- <router-link v-on:click.native="setSection('Servers / ' + server.name)" :to="{ name: 'server', params: { server } }">
         Connect
      </router-link>     -->

  </div>
</template>



<script>
import { mapGetters } from "vuex";
import Server from "./Server.vue";
import ConfigServer from "./ConfigServer.vue";

export default {
  name: "HelloWorld",
  components: {
    Server,
    ConfigServer
  },
  props: {
    msg: String
  },
  methods: {
    setSection: async function(s) {
      await this.$store.dispatch("setSection", s);
    },
    openConnection: async function() {
      let _this = this;
      let docs = await _this.$store.dispatch("openConnection", _this.server);
      _this.docs = docs;
    }
  },
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 300px));
  grid-gap: 10px 15px;
}
</style>
