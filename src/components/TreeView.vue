<template>
  <div class="container">
    <v-row>
      <v-btn icon color="green" @click="toggleDialog" title="Add new directory">
        <v-icon>mdi-folder-plus</v-icon>
      </v-btn>
      <h3 v-if="!paths || paths.length === 0">Click the icon to add directories</h3>
    </v-row>
    <v-row v-if="!isError && paths != null">
      <h2 v-if="paths.length === 0">Loading directories...</h2>
      <div  v-for="path in paths" :key="path">
        <path-tree-view :rootPath="path" />
      </div>
    </v-row>
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
    this.isError = this.paths === null
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
.container {
  overflow: auto
}

h3 {
  margin-top: 4px
}
</style>
