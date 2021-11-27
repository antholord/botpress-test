<template>
  <div v-if="!isError">
    <v-treeview :items="treeItems" open-on-click item-key="path" :load-children="loadChildren">
        <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.type === 'directory'">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
                mdi-file
            </v-icon>
        </template>
    </v-treeview>
  </div>
  <div v-else>
    <h3>Could not find path {{this.rootPath}}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DirectoryItem } from '../models/directory'

@Component
export default class PathTreeView extends Vue {
    @Prop(String) readonly rootPath!: string

    treeItems: DirectoryItem[] = []
    isError = false;

    async created (): Promise<void> {
      this.$electron.ipcRenderer.on('directory-updated', (_, path: string, directoryName: string, newChildren: DirectoryItem[]) => {
        // A directory was updated. We need to find which one it was in our tree of directories.
        if (path === this.rootPath && newChildren) {
          // If the updated directory was at the root, do the replacement
          if (this.treeItems[0].path === directoryName) {
            this.copyAlreadyLoadedChildren(newChildren, this.treeItems[0].children ?? [])
            Vue.set(this.treeItems, 0, { ...this.treeItems[0], children: newChildren })
          } else {
            // Otherwhise, recursively explore our directory tree until we find the one that was replaced.
            // If it was not expanded, we don't need to do anything.
            this.replaceDirectoryItems(directoryName, this.treeItems[0].children, newChildren)
          }
        }
      })
      const directoryItems = await this.$electron.ipcRenderer.invoke('get-files-in-directory', this.rootPath, this.rootPath)
      if (directoryItems) {
        this.treeItems = [{ path: this.rootPath, name: this.rootPath, type: 'directory', children: directoryItems }]
      }
      this.isError = directoryItems === null
    }

    async loadChildren (item: DirectoryItem) : Promise<void> {
      // When a directory is clicked, we dynamically load the children
      return this.$electron.ipcRenderer.invoke('get-files-in-directory', this.rootPath, item.path).then((directoryItems: DirectoryItem[]) => {
        if (item.children && directoryItems && directoryItems.length > 0) {
          item.children.push(...directoryItems)
        }
      })
    }

    replaceDirectoryItems (directoryPath: string, children: DirectoryItem[] = [], newDirectoryItems: DirectoryItem[]): void {
      // look for the directory to replace in this level of children
      for (const item of children) {
        if (item.path === directoryPath) {
          // If the directory we are replacing had expanded children, we want to copy those over to the new directory, to keep the expanded structure intact
          if (item.children) {
            this.copyAlreadyLoadedChildren(newDirectoryItems, item.children)
          }

          item.children = newDirectoryItems
          return
        } else if (directoryPath.includes(item.path)) {
          // The replaced directory was not found at this tree level, so we go down a level
          return this.replaceDirectoryItems(directoryPath, item.children, newDirectoryItems)
        }
      }
    }

    copyAlreadyLoadedChildren (children: DirectoryItem[], oldChildren: DirectoryItem[]) : void {
      for (const item of oldChildren) {
        if (item.children && item.children.length > 0) {
          const matchingNewItem = children.find(c => c.path === item.path)
          if (matchingNewItem) {
            matchingNewItem.children = item.children
          }
        }
      }
    }
}
</script>

<style>
.v-treeview-node__label {
  opacity: 0.8
}
</style>
