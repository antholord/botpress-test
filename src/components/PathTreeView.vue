<template>
  <div>
    <v-treeview  :items="treeItems" open-on-click item-key="path">
        <template v-slot:prepend="{ item, open}">
            <v-icon v-if="item.type === 'directory'">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
                mdi-file
            </v-icon>
        </template>
    </v-treeview>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DirectoryItem } from '../models/directory'

@Component
export default class PathTreeView extends Vue {
    @Prop(String) readonly rootPath!: string

    treeItems: DirectoryItem[] = []
    created (): void {
      this.$electron.ipcRenderer.on('files-changed', (_, path, newTree: DirectoryItem) => {
        if (path === this.rootPath && newTree) {
          this.treeItems = [newTree]
        }
      })
      this.$electron.ipcRenderer.invoke('get-files', this.rootPath)
        .then((directoryTree: DirectoryItem) => {
          if (directoryTree) {
            this.treeItems = [directoryTree]
          }
        })
    }
}
</script>
