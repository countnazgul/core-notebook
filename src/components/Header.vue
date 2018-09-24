<template>
  <div class="header1">  
      <div class="homeIcon">
        <router-link v-on:click.native="setSection('Home')" to="/"><span class="lui-icon lui-icon--home hdr" aria-hidden="true" title="Home"></span></router-link>
      </div>
      <div class="section">{{section.toUpperCase()  }}</div>
      <div class="configIcon">
        <router-link v-on:click.native="setSection('Config')" to="/config"><span class="lui-icon lui-icon--cogwheel hdr" aria-hidden="true" title="Config"></span></router-link>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Config",
  components: {},
  methods: {
    setSection: async function(s) {
      await this.$store.dispatch("setSection", s);
    }
  },
  props: {},
  computed: {
    ...mapGetters({
      section: "section"
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

.header1 {
  display: grid;
  grid-template-rows: 40px;
  grid-template-columns: 50px auto 50px;
  background-color: #f7921d;
  height: 40px;
  justify-items: center;
  align-items: center;
}

.hdr {
  font-size: 30px;
  color: white;
  text-decoration: none;
}

.homeIcon {
  grid-row: 1;
  grid-column: 1;
  align-self: end;
  margin-bottom: 5px;
}

.configIcon {
  grid-row: 1;
  grid-column: 3;
  align-self: end;
  margin-bottom: 5px;  
}

.section {
  font-weight: bold;
  font-size: 25px;
  color: white;
  /* justify-self: left; */
  /* align-self: end; */
  grid-row: 1;
  grid-column: 2;

}
</style>
