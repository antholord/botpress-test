import chokidar, { FSWatcher } from 'chokidar'
import { BrowserWindow, ipcMain } from 'electron'
import dirTree from 'directory-tree'
import _ from 'lodash'

const watchers: Record<string, FSWatcher> = {}

const getDirectoryTree = (path: string) => dirTree(path, { normalizePath: true, attributes: ['type'] })

const setupEvents = (paths: string[]) : void => {
  ipcMain.on('get-paths', (e) => {
    e.returnValue = paths
  })
  ipcMain.handle('get-files', async (e, path) => {
    return getDirectoryTree(path)
  })
}

export const ProcessDirectories = (window: BrowserWindow): void => {
  const paths = process.argv.slice(2)
  setupEvents(paths)
  for (const path of paths) {
    const watcher = chokidar.watch(path)

    watcher.on('ready', () => {
      watchers[path] = watcher
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      watcher.on('all', _.debounce((event: any, path: string) => {
        window.webContents.send('files-changed', path, getDirectoryTree(path))
      }, 100))
    })

    setInterval(() => {
      window.webContents.send('files-changed', path, getDirectoryTree(path))
    }, 4000)
  }
}
console.log(process.argv)
