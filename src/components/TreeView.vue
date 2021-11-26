<template>
  <div class="container">
    <h2 v-if="paths.length === 0">Loading directories...</h2>
    <div v-else v-for="path in paths" :key="path">
      <path-tree-view :rootPath="path"></path-tree-view>
      <v-spacer v-if="paths.length > 1"></v-spacer>
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
    // this is not ideal but it's a way to wait until the backend is ready to get the paths
    const loadPaths = setInterval(() => {
      this.paths = this.$electron.ipcRenderer.sendSync('get-paths') ?? []
      if (this.paths.length > 0) clearInterval(loadPaths)
    }, 1000)
  }
}
</script>

<style scoped>
h2 {
  margin: 40px;
}

.container {
  overflow: auto
}
</style>
