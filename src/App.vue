<template>
  <div id="app">
    <div>
      <h1>Directory Tree View for Botpress</h1>
    </div>
    <TreeView />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TreeView from './components/TreeView.vue'

@Component({
  components: {
    TreeView
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  opacity: 60%;

  margin-top: 10px;
}

body {
background-color: #332940;
}
</style>
