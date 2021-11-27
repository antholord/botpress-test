<template>
  <div v-if="!isError">
    <v-treeview  :items="treeItems" open-on-click item-key="path" :load-children="loadChildren">
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
  <div v-else><h3>Could not find path {{this.rootPath}}</h3></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DirectoryItem } from '../models/directory'

@Component
export default class PathTreeView extends Vue {
    @Prop(String) readonly rootPath!: string

    treeItems: DirectoryItem[] = []

    isError = false;
    created (): void {
      this.$electron.ipcRenderer.on('directory-updated', (_, path: string, directoryName: string, newChildren: DirectoryItem[]) => {
        // Check if
        if (path === this.rootPath && newChildren) {
          // If the updated directory was at the root, do the replacement
          if (this.treeItems[0].path === directoryName) {
            this.copyAlreadyLoadedChildren(newChildren, this.treeItems[0].children ?? [])
            Vue.set(this.treeItems, 0, { ...this.treeItems[0], children: newChildren })
            // this.treeItems = [{ path: this.rootPath, name: this.rootPath, type: 'directory', children: newChildren }]
          } else {
            this.replaceDirectory(this.treeItems[0].children, directoryName, newChildren)
          }
        }
      })
      this.$electron.ipcRenderer.invoke('get-files-in-directory', this.rootPath)
        .then((directoryTree: DirectoryItem[]) => {
          if (directoryTree) {
            this.treeItems = [{ path: this.rootPath, name: this.rootPath, type: 'directory', children: directoryTree }]
            console.log(this.treeItems)
          } else {
            this.isError = true
          }
        })
    }

    async loadChildren (item: DirectoryItem) : Promise<void> {
      return this.$electron.ipcRenderer.invoke('get-files-in-directory', item.path).then((directoryItems: DirectoryItem[]) => {
        if (item.children && directoryItems && directoryItems.length > 0) {
          item.children.push(...directoryItems)
        }
      })
    }

    replaceDirectory (children: DirectoryItem[] = [], directory: string, newDirectory: DirectoryItem[]): void {
      // look for the directory to replace in this level of children
      for (let i = 0; i < children.length; i++) {
        const item = children[i]
        console.log(directory)
        console.log(item.path)
        if (item.path === directory) {
          if (item.children) {
            this.copyAlreadyLoadedChildren(newDirectory, item.children)
          }

          item.children = newDirectory
          return
        } else if (directory.includes(item.path)) {
          return this.replaceDirectory(item.children, directory, newDirectory)
        }
      }

      // If it was not found in this level, we must find the children that match and go down to its level
    }

    copyAlreadyLoadedChildren (children: DirectoryItem[], oldChildren: DirectoryItem[]) : void{
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
