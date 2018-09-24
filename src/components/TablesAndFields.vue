<template>
  <div id="tables-and-fields1">
    <md-table v-model="searched" md-card md-fixed-header style="height: 500px;">
      <md-table-toolbar>
        <h1 class="md-title">Fields</h1>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by field..." v-model="search" @input="searchOnTable" />
        </md-field>        
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Table" md-sort-by="table" md-numeric>{{ item.table }}</md-table-cell>
        <md-table-cell md-label="Field" md-sort-by="name">{{ item.name }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>
<script>
const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(function(item) {
      return toLower(item.name).includes(toLower(term));
    });
  }

  return items;
};

export default {
  name: "TablesAndFields",
  props: ["tablesAndFields"],
  data: () => ({
    search: null,
    searched: []
  }),
  methods: {
    searchOnTable() {
      this.searched = searchByName(this.tablesAndFields, this.search);
    }
  },
  created() {
    this.searched = this.tablesAndFields;
  }
};
</script>
<style>
</style>
