import * as Electron from 'electron'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $electron: typeof Electron
  }
}
