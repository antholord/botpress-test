<template>
  <div>
    {{rootPath}}
    <Tree></Tree>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Tree from 'vuejs-tree'

@Component({
  components: {
    Tree: Tree
  }
})
export default class PathTreeView extends Vue {
    @Prop(String) readonly rootPath!: string

    created (): void {
      this.$electron.ipcRenderer.on('path-change', (e, event, path) => {
        console.log(event)
        console.log(path)
      })
      this.$electron.ipcRenderer.invoke('get-files', this.rootPath).then((result) => {
        console.log(result)
        // this.files = result
      })
      // console.log(files)
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
