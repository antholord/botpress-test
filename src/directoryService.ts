import chokidar, { FSWatcher } from 'chokidar'
import { BrowserWindow, ipcMain } from 'electron'

const watchers: Record<string, FSWatcher> = {}

const setupEvents = (paths: string[]) : void => {
  ipcMain.on('get-paths', (e) => {
    e.returnValue = paths
  })
  ipcMain.handle('get-files', async (e, path) => {
    const watcher = watchers[path]
    if (watcher) {
      return watcher.getWatched()
    }
  })
}

export const ProcessDirectories = (window: BrowserWindow): void => {
  const paths = process.argv.slice(2)
  setupEvents(paths)
  for (const path of paths) {
    const watcher = chokidar.watch(path)
    watcher.on('all', (event, path) => {
      window.webContents.send('path-change', event, path)
    })
    watcher.on('ready', () => {
      watchers[path] = watcher
      // window.webContents.send('watcher-ready', watcher.getWatched())
    })
  }
}
console.log(process.argv)
