<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Botpress File Explorer</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <DirectoryTreeList/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import DirectoryTreeList from './components/DirectoryTreeList.vue'

export default Vue.extend({
  name: 'App',

  components: {
    DirectoryTreeList
  }
})
</script>

<style>
.theme--dark.v-application {
  background: #2d2a2e !important
}
</style>
