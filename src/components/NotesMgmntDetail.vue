<template>

  <div class="notes-mgmnt-detail">    
    <div>
        Server: {{serverName}}<br>
        Doc: {{note.appName}} ({{note.appId}})
    </div>
    <div>
        <br>
        Code: <br>
        {{note.code}}
    </div>
    <hr>
    <!-- <md-divider></md-divider> -->
    <!-- <md-field>
      <label>App Id</label>
      <md-input v-model="note.appId" disabled></md-input>
    </md-field>   

    <md-field>
      <label>Code</label>
      <md-textarea v-model="note.code" disabled></md-textarea>
    </md-field> -->
    <!-- <md-divider></md-divider> -->
  </div>
</template>

<script>
export default {
  name: "NotesMgmntDetail",
  components: {},
  props: ["note", "servers"],
  data: function() {
    return {
      notesLocal: [],
      serverName: ''
    };
  },
  methods: {},
  mounted: function() {
      let _this = this
      let server = _this.servers.filter(function(s) {
          return s.id = _this.note.serverId 
      })
    _this.serverName = server[0].name;
  },
  computed: {
    test: function() {}
    //   this.notesLocal = this.notes
  }
};
</script>

<style scoped>
</style>
