<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Botpress File Explorer</v-toolbar-title>

    </v-app-bar>
    <v-main>
      <v-container>
        <tree-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeView from './components/TreeView.vue'

export default Vue.extend({
  name: 'App',

  components: {
    TreeView
  },

  created (): void {
    this.$vuetify.theme.dark = true
  }
})
</script>

<style>
.theme--dark.v-application {
  background: #2d2a2e !important
}
</style>
