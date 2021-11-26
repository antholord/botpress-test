<template>
  <div class="container">
    <div v-if="isError">
      <h3>Please provide valid file paths as param</h3>
    </div>
    <div v-else-if="paths != null">
      <h2 v-if="paths.length === 0">Loading directories...</h2>
      <div  v-for="path in paths" :key="path">
        <path-tree-view :rootPath="path" />
      </div>
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
  paths: string[] | null = []
  isError = false

  mounted (): void {
    this.paths = this.$electron.ipcRenderer.sendSync('get-paths')
    if (this.paths === null) {
      this.isError = true
    }
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
