import chokidar from 'chokidar'
import { BrowserWindow, ipcMain } from 'electron'
import dirTree from 'directory-tree'
import _ from 'lodash'

const getDirectoryTree = (path: string) => dirTree(path, { normalizePath: true, attributes: ['type'] })

export const SetupEvents = () : void => {
  const pathParams = process.argv.slice(2)
  // If no path arguments were provided, send null to the client so it can display errors
  const paths = pathParams.length > 0 ? pathParams : null

  ipcMain.on('get-paths', (e) => {
    e.returnValue = paths
  })
  ipcMain.handle('get-files', async (e, path) => {
    return getDirectoryTree(path)
  })
}

export const ProcessDirectories = (window: BrowserWindow): void => {
  const paths = process.argv.slice(2)
  for (const path of paths) {
    const watcher = chokidar.watch(path)

    watcher.on('ready', () => {
      watcher.on('all', _.debounce((_: unknown, path: string) => {
        window.webContents.send('files-changed', path, getDirectoryTree(path))
      }, 100))
    })
    // todo: remove
    setInterval(() => {
      window.webContents.send('files-changed', path, getDirectoryTree(path))
    }, 4000)
  }
}
