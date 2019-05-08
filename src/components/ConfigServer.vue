<template>
<div class='container'>
    <div class="config-server">           
        <md-field>      
            <label>Name</label>
            <md-input v-model="server.name" class="tInput" :disabled="connect"></md-input>
        </md-field>
        <md-field>
            <label>Host</label>
            <md-input v-model="server.host" class="tInput" :disabled="connect"></md-input>
        </md-field>                
        <md-field>
            <label>Port</label>       
            <md-input v-model="server.port" class="tInput" :disabled="connect"></md-input>
        </md-field>
        <div class="empty">
            <div v-if="!connect" style="float: right">
                <md-button v-on:click="saveServer" class="md-icon-button" title="Test connection">
                  <span class="lui-icon  lui-icon--disconnect" aria-hidden="true"></span>
                </md-button>
                <md-button v-on:click="saveServer" class="md-icon-button" title="Save">
                  <span class="lui-icon  lui-icon--save" aria-hidden="true"></span>
                </md-button>                  
                <md-button @click="active = true" class="md-icon-button md-accent" title="DELETE">
                  <span class="lui-icon  lui-icon--bin" aria-hidden="true"></span>
                </md-button>                                                
                
            </div>
            <div v-if="connect" style="float: right">
                <md-progress-spinner v-if="connecting" md-mode="indeterminate" :md-diameter="36" style="margin-top: 5px;"></md-progress-spinner>
                <md-button v-on:click="openConnection" class="md-raised md-primary" :disabled="connecting">{{label}}</md-button>
            </div>            
        </div>
    </div>

    <md-dialog-confirm
      :md-active.sync="active"
      md-title="Delete server"
      md-content="Are you sure you want to delete this server?"
      md-confirm-text="Yes"
      md-cancel-text="Cancel"
      @md-cancel="onCancel"
      @md-confirm="deleteServer"      
    />  

    <md-snackbar :md-position="snackbar.position" :md-duration="snackbar.isInfinity ? Infinity : snackbar.duration" :md-active.sync="snackbar.showSnackbar" md-persistent>
      <span>Error! Connection failed :(</span>
    </md-snackbar>

    <md-snackbar :md-position="snackbar.position" :md-duration="snackbar.isInfinity ? Infinity : snackbar.duration" :md-active.sync="snackbar.showSnackbarTest" md-persistent>
      <span>Connection ok!</span>
    </md-snackbar>    

  </div>
</template>

<script>
export default {
  name: "ConfigServer",
  components: {},
  props: ["server", "connect"],
  data: function() {
    return {
      active: false,
      value: null,
      connecting: false,
      label: "Connect",
      snackbar: {
        position: "center",
        duration: 4000,
        showSnackbar: false,
        isInfinity: false,
        showSnackbarTest: false
      }
    };
  },
  methods: {
    onCancel() {
      //   this.value = "Disagreed";
    },
    deleteServer: async function() {
      let server = await this.$store.dispatch("deleteServer", this.server);
    },
    saveServer: async function() {
      let server = await this.$store.dispatch("saveServer", this.server);
    },
    setSection: async function(s) {
      await this.$store.dispatch("setSection", s);
    },
    openConnection: async function() {
      let _this = this;

      _this.connecting = true;
      _this.label = "Connecting";
      let docs = await _this.$store.dispatch("openConnection", _this.server);

      if (docs == true) {
        _this.connecting = false;
        _this.label = "Connect";
        _this.snackbar.showSnackbar = true;
      } else {
        //   _this.docs = docs;
        _this.connecting = false;
        _this.label = "Connect";

        _this.$router.push({
          name: "server",
          params: { server: _this.server, docs }
        });
      }
    }
  },
  computed: {}
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

.container {
  border: 1px solid #d3d3d3;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.config-server {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto auto;
  margin: 10px;
  grid-gap: 5px;
}

.titles {
  font-size: 14px;
}

.name {
  grid-column: 1;
  grid-row: 1;
}

.host {
  grid-column: 1;
  grid-row: 2;
}

.port {
  grid-column: 1;
  grid-row: 3;
}

.empty {
  grid-column: 1;
  grid-row: 4;
  /* float: right; */
}

.tInput {
  /* /* padding:5px; */
  font-size: 14px !important;
  font-family: "Hack";
}

.md-field {
  margin-bottom: 10px !important;
}
</style>
