<template>
  <div class="page-container1">
    <md-app md-waterfall md-mode="fixed">
        <md-app-toolbar v-if="liveDoc.id" class="md-primary">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">{{liveDocName}}</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" v-on:click="getFields()" md-menu-trigger title="Fields">
              <span class="lui-icon lui-icon--field lui-icon--large" aria-hidden="true"></span>
            </md-button>
            <md-button v-on:click="collapseAll(false)" class="md-icon-button" title="Collapse All">
              <md-icon><span class="lui-icon lui-icon--arrow-up lui-icon--large" aria-hidden="true"></span></md-icon>
            </md-button>
            <md-button v-on:click="collapseAll(true)" class="md-icon-button" title="Expand All">
              <md-icon><span class="lui-icon lui-icon--arrow-down lui-icon--large" aria-hidden="true"></span></md-icon>
            </md-button>     
            <md-button v-on:click="deleteModalActive = true" class="md-icon-button" title="DELETE ALL">
              <md-icon><span class="lui-icon lui-icon--bin lui-icon--large" aria-hidden="true"></span></md-icon>
            </md-button>    
            <md-button v-on:click="closeDoc" class="md-icon-button" title="Close App">
              <md-icon><span class="lui-icon lui-icon--close lui-icon--large" aria-hidden="true"></span></md-icon>
            </md-button>                                    
          </div>
        </md-app-toolbar>


      <md-app-drawer :md-active.sync="menuVisible" md-persistent="full" >
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="title">DOCUMENTS</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item v-for="doc in docs" v-bind:key="doc.qDocId" >
            <span v-on:click="openDoc({qDocId: doc.qDocId, qDocName: doc.qDocName})" class="md-list-item-text pointer" :class="{ bold: doc.qDocName == liveDocName }" >{{doc.qDocName}}</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div v-if="liveDoc.id" >           
          <Note v-for="note in notes"  v-bind:key="note.id" :note="note" :liveDoc="liveDoc"></Note>

          <md-button v-on:click="addNote" class="md-fab md-primary md-fab-bottom-right" title="Add Note">
            <md-icon>add</md-icon>
          </md-button>
        </div>

        <div v-if="loading" >
          <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>

      </md-app-content>

    </md-app>

    <md-dialog-confirm
      :md-active.sync="deleteModalActive"
      md-title="Delete all?"
      md-content="Are you sure you want to delete <strong>all</strong> notes for this app?"
      md-confirm-text="Yes"
      md-cancel-text="Cancel"
      @md-confirm="onConfirm" />

    <modal name="hello-world"
    :adaptive="true"
    :scrollable="false"
    :height="500"
    @before-close="beforeCloseModal"
    >
      <div v-if="fieldsLoading" >
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>    

      <tables-and-fields v-if="!fieldsLoading" :tablesAndFields="tablesAndFields"></tables-and-fields>
    </modal>

    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Note from "./Note.vue";
import TablesAndFields from "./TablesAndFields.vue";

export default {
  name: "Server",
  props: ["server", "docs"],
  components: {
    Note,
    TablesAndFields
  },
  data: function() {
    return {
      // docs: [],
      loading: false,
      fieldsLoading: true,
      notebook: {},
      notes: [],
      liveDoc: {},
      liveDocName: "",
      liveDocFields: [],
      showNavigation: true,
      menuVisible: true,
      deleteModalActive: false,
      tablesAndFields: []
    };
  },
  computed: {
    ...mapGetters({
      enigmaInstance: "enigmaInstance",
      storeNotes: "getNotes",
      section: "section"
    })
  },
  mounted: function() {
    let _this = this;

    if (!_this.server) {
      _this.$router.push({ name: "home" });
    }
  },
  methods: {
    removeAllNotes: async function() {
      let _this = this;
      let note = await _this.$store.dispatch("removeAllNotes", {
        serverId: _this.server.id,
        appId: _this.liveDoc.id
      });
    },
    addNote: async function() {
      let _this = this;
      let note = await _this.$store.dispatch("addNote", {
        serverId: _this.server.id,
        appId: _this.liveDoc.id
      });
    },
    // openConnection: async function() {
    //   let _this = this;
    //   let docs = await _this.$store.dispatch("openConnection", _this.server);
    //   _this.docs = docs;
    // },
    closeDoc: async function() {
      let _this = this;

      try {
        _this.liveDoc = {};
        _this.liveDocName = "";
        _this.notebook = {};
        await _this.enigmaInstance.session.close();
      } catch (e) {
        console.log(e);
      }
    },
    openDoc: async function({ qDocId, qDocName }) {
      let _this = this;
      _this.loading = true;
      _this.liveDoc = {};
      _this.liveDocName = "";
      let d = null;
      _this.notebook = {};

      try {
        let a = await _this.enigmaInstance.session.close();
      } catch (e) {
        console.log(e);
      }

      try {
        let docs = await _this.$store.dispatch("openConnection", _this.server);
        // _this.docs = docs;
        _this.$router.push({
          name: "server",
          params: { server: _this.server, docs }
        });
      } catch (e) {
        console.log(e);
      }

      try {
        d = await _this.enigmaInstance.global.openDoc(qDocId);
        // let docs = await this.$store.dispatch(
        //   "setSection",
        //   _this.section + " / " + qDocName
        // );

        _this.liveDoc = d;
        _this.liveDocName = qDocName;

        // console.log("doc open", d);
      } catch (e) {
        console.log(e);
        // d = await _this.enigmaInstance.global.openDoc(qDocId);
        // console.log("sesison closed and doc open", d);
      }

      let notes = await _this.$store.dispatch("getNotebook", {
        serverId: _this.server.id,
        appId: qDocId
      });

      _this.loading = false;
      _this.notes = notes;
      _this.liveDoc = d;
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    collapseAll: async function(expanded) {
      let _this = this;
      let notes = await _this.$store.dispatch("collapseAll", {
        serverId: _this.server.id,
        appId: _this.liveDoc.id,
        expanded: expanded
      });
    },
    onConfirm: async function() {
      let _this = this;
      let notes = await _this.$store.dispatch("removeAllNotes", {
        serverId: _this.server.id,
        appId: _this.liveDoc.id
      });
    },
    getFields: async function() {
      let _this = this;
      _this.$modal.show("hello-world");
      // let notes = await _this.$store.dispatch("removeAllNotes", {
      //   serverId: _this.server.id,
      //   appId: _this.liveDoc.id
      // });

      let props = {
        qInfo: {
          qId: "",
          qType: "FieldList"
        },
        qFieldListDef: {
          qShowSystem: true,
          qShowHidden: true,
          qShowSemantic: true,
          qShowSrcTables: true
        }
      };

      let sessionObject = await _this.liveDoc.createSessionObject(props);
      let layout = await sessionObject.getLayout();

      let tablesAndFields = await _this.liveDoc.getTablesAndKeys({
        qIncludeSysVars: true
      });

      // _this.tablesAndFields = tablesAndFields.qtr

      let tablesAndFieldsOrg = [];
      for (let item of tablesAndFields.qtr) {
        for (let field of item.qFields) {
          tablesAndFieldsOrg.push({
            table: item.qName,
            name: field.qName
          });

          // tablesAndFieldsOrg.push({
          //   table: item.qName,
          //   name: field.qName
          // })
        }
      }

      _this.fieldsLoading = false
      _this.tablesAndFields = tablesAndFieldsOrg;
      _this.liveDocFields = layout.qFieldList.qItems;

      // console.log(layout)
    },
    beforeCloseModal: function() {
      this.fieldsLoading = true
    }
  },
  watch: {
    storeNotes: async function(newVal, oldVal) {
      let _this = this;
      let notes = await newVal.filter(function(n) {
        return n.serverId == _this.server.id && n.appId == _this.liveDoc.id;
      });

      _this.notes = notes;
    }
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

.bold {
  font-weight: bold;
}

.title {
  font-weight: bold;
  font-size: 16px;
}

/* .server-content {
  display: grid;
  grid-template-columns: 20% 80%;
  grid-template-rows: auto auto auto;
}

.server-header {
  grid-row: 1;
  grid-column-start: 1;
  grid-column-end: 1;
} */

/* .content {
  grid-row: 2;
  grid-column-start: 2 ;
  grid-column-end: 2;
} */

/* .docs-test {
  grid-row-start: 2;
  grid-row-end: span 3;
  grid-column-start: 1;
  grid-column-end: 2;
} */

/* .notes-test {
  grid-row-start: 1;
  grid-row-end: span 3;
  grid-column-start: 2;
  grid-column-end: 2;
} */

.md-app {
  max-height: 100%;
  min-height: 100%;
  border: 1px solid rgba(#000, 0.12);
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>
