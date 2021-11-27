<template>
  <div class="container directory-tree-container">
    <v-row>
      <v-btn icon color="green" @click="toggleDialog" title="Add new directory">
        <v-icon>mdi-folder-plus</v-icon>
      </v-btn>
      <h3 v-if="!paths || paths.length === 0">
        Click the icon to add directories
      </h3>
    </v-row>
    <v-row v-if="isError">
      <h3>There was an error loading the specified paths.</h3>
    </v-row>
    <div class="wrapper" v-if="!isError && paths != null">
      <v-row v-for="path in paths" :key="path">
        <DirectoryTree :rootPath="path" />
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { OpenDialogReturnValue } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import DirectoryTree from './DirectoryTree.vue'

@Component({
  components: {
    DirectoryTree
  }
})
export default class TreeView extends Vue {
  paths: string[] | null = []

  get isError (): boolean { return this.paths === null }

  mounted (): void {
    this.loadPaths()
  }

  async toggleDialog (): Promise<void> {
    try {
      const dialog = this.$electron.remote.dialog
      const result = await dialog.showOpenDialog({
        title: 'Select Directory',
        properties: ['openDirectory', 'dontAddToRecent', 'multiSelections']
      })
      if (result) {
        this.processDialogResult(result)
      }
    } catch (e) {
      alert(e)
    }
  }

  loadPaths (): void {
    this.paths = this.$electron.ipcRenderer.sendSync('get-paths')
  }

  async processDialogResult (result: OpenDialogReturnValue): Promise<void> {
    if (result.canceled === true) return
    const files = result.filePaths
    if (files.length === 0) {
      return
    }
    await this.$electron.ipcRenderer.invoke('add-paths', files)
    this.loadPaths()
  }
}
</script>

<style scoped>
.directory-tree-container {
  overflow: auto;
  min-height: 100px;
}

.directory-tree-container > .wrapper {
  padding-top:20px;
}

h3 {
  margin-top: 4px
}
</style>
