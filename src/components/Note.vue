<template>
  <div class="note">
    <div class="note-content">
      <md-list :md-expand-single="expandSingle">
        <md-list-item md-expand  :md-expanded.sync="note.expanded">
          <span class="md-list-item-text">{{note.title}}</span>

          <md-list slot="md-expand">
            <div class="code">
              <md-button v-on:click="run" class="md-icon-button md-primary run-note" title="Calculate">
                <md-icon><span class="lui-icon  lui-icon--run lui-icon--large" aria-hidden="true"></span></md-icon>
              </md-button>
              <md-button v-on:click="remove" class="md-icon-button md-accent evaluate-note" disabled title="Evaluate">
                <md-icon><span class="lui-icon  lui-icon--debug lui-icon--large" aria-hidden="true" ></span></md-icon>
              </md-button>
              <md-button v-on:click="remove" class="md-icon-button md-accent delete-note" title="Remove">
                <md-icon><span class="lui-icon  lui-icon--remove lui-icon--large" aria-hidden="true" ></span></md-icon>
              </md-button>              
              <!-- <md-field class="text-note">
                <md-textarea v-model="note.code" class="text-code"></md-textarea>
              </md-field> -->
              <md-field class="text-note">
                <MonacoEditor ref="editor"
                          class="editor"
                          style="width: 100%"
                          placeholder="<div>Hello Qlik!</div>"
                          value="1233123123"
                          language="sql"
                          :options=options
                          :value=note.code
                          v-on:change="codeChange"
                          v-on:keydown="keyPressed"
                        />
                </md-field>  
            </div>
            <md-field>      
              <label>Result</label>
              <md-input  v-model="result" class="tInput"></md-input>
            </md-field>    

            <!-- <div class="actions">
              <md-button v-on:click="run" class="md-icon-button md-raised md-primary" title="Calculate">
                <md-icon><span class="lui-icon  lui-icon--run lui-icon--large" aria-hidden="true"></span></md-icon>
              </md-button>
              <md-button v-on:click="remove" class="md-icon-button md-accent" title="Remove">
                <md-icon><span class="lui-icon  lui-icon--remove lui-icon--large" aria-hidden="true" ></span></md-icon>
              </md-button> 
            </div> -->
          </md-list>
        </md-list-item>
      </md-list>

    

      <!-- <md-field>
        <label>{{title}}</label>
        <md-textarea v-model="note.code"></md-textarea>
      </md-field>
      <md-field>      
        <label>Result</label>
        <md-input  v-model="result" class="tInput"></md-input>
      </md-field>    

      <md-button v-on:click="run" class="md-icon-button md-raised md-primary" title="Calculate">
        <md-icon><span class="lui-icon  lui-icon--run lui-icon--large" aria-hidden="true"></span></md-icon>
      </md-button>
      <md-button v-on:click="remove" class="md-icon-button md-accent" title="Remove">
        <md-icon><span class="lui-icon  lui-icon--remove lui-icon--large" aria-hidden="true" ></span></md-icon>
      </md-button>     -->
    </div>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";

export default {
  name: "Note",
  props: ["note", "liveDoc"],
  components: {
    MonacoEditor
  },
  data: function() {
    return {
      result: "",
      title: "Expression",
      expandSingle: false,
      expanded: true,
      options: {
        //https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
        lineNumbers: true,
        contextmenu: false,
        fontFamily: "Hack",
        minimap: {
          enabled: false
        }
      }
    };
  },
  methods: {
    run: async function() {
      let _this = this;

      // let saveCode = await _this.$store.dispatch("saveCode", { id: _this.id });

      const properties = {
        qInfo: {
          qType: "StringExpression"
        },
        expr: {
          qStringExpression: { qExpr: `=${_this.note.code}` }
        }
      };

      try {
        let qObject = await _this.liveDoc.createObject(properties);
        let layout = await qObject.getLayout();
        _this.result = layout.expr;
      } catch (e) {
        console.log(e);
      }
    },
    remove: async function() {
      let _this = this;

      let removeResult = await _this.$store.dispatch(
        "removeNote",
        _this.note.id
      );
    },
    codeChange: async function(newVal) {
      this.note.code = newVal;
    },
    keyPressed: async function(key) {
      let _this = this;

      // console.log(_this.$refs)
      // let monaco = _this.$refs.editor.getMonaco();
      // console.log(_this.$refs.editor);
      // console.log(monaco);

      if (key.ctrlKey == true && key.keyCode == 3) {
        _this.run();
      }
    }
  },
  watch: {
    note: {
      async handler(n, o) {
        let _this = this;
        // console.log(n);
        let docs = await _this.$store.dispatch("updateNote", n);
      },
      deep: true
    },
    "note.code": function(newVal, oldVal) {
      let _this = this;
      let hasTitle = false;
      let titlePrefix = newVal.substring(0, 5);

      if (titlePrefix == "//** ") {
        _this.note.title = newVal.substring(5, newVal.indexOf("\n"));
      } else {
        _this.note.title = "Expression";
      }
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

.note {
  border: 1px solid #d3d3d3;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-bottom: 10px;
}

.note-content {
  margin: 10px;
}

.actions {
  margin-bottom: 10px;
}

.code {
  height: 120px;
  display: grid;
  grid-template-columns: 1fr 25fr;
  grid-template-rows: auto auto;
}

.run-note {
  grid-row: 1;
  grid-column: 1;
  /* align-self: auto; */
  /* justify-self: auto; */
  margin-left: 0px !important;
}

.evaluate-note {
  grid-row: 2;
  grid-column: 1;
  /* align-self: auto; */
  /* justify-self: auto; */
  margin-left: 0px !important;
}

.delete-note {
  grid-row: 3;
  grid-column: 1;
  /* align-self: auto; */
  /* justify-self: auto; */
}

.text-note {
  grid-row-start: 1;
  grid-row-end: span 3;
  grid-column: 2;
  padding: 4px !important;
}

.md-field {
  /* height: 120px; */
  margin-bottom: 0px !important;
  margin-top: 0px !important;
}

.text-code {
  padding: 4px !important;
}
</style>
