<template>

  <div class="notes-mgmnt-detail">    
    <!-- <md-divider></md-divider> -->
    <md-field>
      <label>App Id</label>
      <md-input v-model="note.appId" disabled></md-input>
    </md-field>   

    <md-field>
      <label>Code</label>
      <md-textarea v-model="note.code" disabled></md-textarea>
    </md-field>
    <!-- <md-divider></md-divider> -->
  </div>
</template>

<script>
export default {
  name: "NotesMgmntDetail",
  components: {},
  props: ["note"],
  data: function() {
    return {
      notesLocal: []
    };
  },
  methods: {},
  computed: {
    //   this.notesLocal = this.notes
  }
};
</script>

<style scoped>
</style>
