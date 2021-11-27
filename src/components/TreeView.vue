<template>
  <div class="container">
    <div v-if="isError">
      <h3>Please provide valid file paths as param</h3>
    </div>
    <div>
      <v-btn icon color="green" @click="toggleDialog" title="Add new directory">
        <v-icon>mdi-folder-plus</v-icon>
      </v-btn>
    </div>
    <div v-if="!isError && paths != null">
      <h2 v-if="paths.length === 0">Loading directories...</h2>
      <div  v-for="path in paths" :key="path">
        <path-tree-view :rootPath="path" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { OpenDialogReturnValue } from 'electron'
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
    this.loadPaths()
  }

  toggleDialog (): void {
    const dialog = this.$electron.remote.dialog
    dialog.showOpenDialog({
      title: 'Select Directory',
      properties: ['openDirectory', 'dontAddToRecent', 'multiSelections']
    }).then(result => {
      if (result) {
        this.processDialogResult(result)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  loadPaths (): void {
    this.paths = this.$electron.ipcRenderer.sendSync('get-paths')
    if (this.paths === null) {
      this.isError = true
    }
  }

  async processDialogResult (result: OpenDialogReturnValue): Promise<void> {
    if (result.canceled === true) return
    const files = result.filePaths
    if (files.length === 0) {
      return
    }
    console.log(files)
    await this.$electron.ipcRenderer.invoke('add-paths', files)
    this.loadPaths()
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
