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
import { TreeItem } from '../models/tree'

@Component
export default class PathTreeView extends Vue {
    @Prop(String) readonly rootPath!: string

    treeItems: TreeItem[] = []
    created (): void {
      this.$electron.ipcRenderer.on('files-changed', (_, path, newTree: TreeItem) => {
        if (path === this.rootPath) {
          this.treeItems = [newTree]
        }
      })
      this.$electron.ipcRenderer.invoke('get-files', this.rootPath).then((result: TreeItem) => {
        this.treeItems = [result]
      })
    }
}
</script>
