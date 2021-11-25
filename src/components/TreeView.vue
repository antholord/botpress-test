<template>
<div>
  <h2 v-if="paths.length === 0">Loading directories...</h2>
  <div v-else v-for="path in paths" :key="path">
    <path-tree-view :rootPath="path"></path-tree-view>
  </div>
</div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PathTreeView from './PathTreeView.vue'

@Component({
  components: {
    PathTreeView
  }
})
export default class TreeView extends Vue {
  paths: string[] = []
  mounted (): void {
    const loadPaths = setInterval(() => {
      this.paths = this.$electron.ipcRenderer.sendSync('get-paths') ?? []
      if (this.paths.length > 0) clearInterval(loadPaths)
    }, 1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
