<template>
  <div class="notes-mgmnt">
    <md-field>
      <label>Search Code</label>
      <md-input v-model="searchString"></md-input>
    </md-field>
    
    <note-detail v-for="note in filtered" v-bind:key="note.id" :note="note"></note-detail>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NoteDetail from "./NotesMgmntDetail.vue";

export default {
  name: "NotesMgmnt",
  components: { NoteDetail },
  props: {},
  data: function() {
    return {
      searchString: "",
      not: []
    };
  },
  methods: {},
  computed: {
    ...mapGetters({
      notes: "getNotes"
    }),
    filtered() {
      let _this = this;

      let filtered = this.notes.filter(function(f) {
        return f.code.toLowerCase().includes(_this.searchString.toLowerCase());
      });

      return filtered;
    }
  },
  watch: {
    notes: {
      deep: true,
      handler(value) {
        console.log(value);
        this.not = value;
      }
    }
  }
};
</script>

<style scoped>
</style>
