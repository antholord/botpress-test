<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Botpress File Explorer</v-toolbar-title>
      <v-spacer></v-spacer>
      <h3 v-if="!isBackendReady">Loading Watchers...</h3>
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
  data () {
    return {
      isBackendReady: false
    }
  },
  created () {
    this.$electron.ipcRenderer.on('watcher-ready', () => {
      this.isBackendReady = true
    })
  }
})
</script>

<style>
.theme--dark.v-application {
  background: #2d2a2e !important
}
</style>
