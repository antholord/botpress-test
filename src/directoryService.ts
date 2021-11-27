import { DirectoryItem } from './models/directory'
import chokidar, { FSWatcher } from 'chokidar'
import { ipcMain } from 'electron'
import { window } from './background'
import fs from 'fs'
import util from 'util'

import { getCmdArgumentPaths, getResolvedPaths, isPathADirectory, normalizePath } from './utils/directoryUtils'

const readdir = util.promisify(fs.readdir)

// each root path will have its own file watcher, to separate events per root path better.
const watchers: Record<string, FSWatcher> = {}
// each rootPath will be its own category. Root paths can be added dynamically.
let rootPaths: string[] | null = []

export const SetupEvents = () : void => {
  rootPaths = getCmdArgumentPaths()
  ipcMain.on('get-paths', (e) => {
    e.returnValue = rootPaths
  })
  ipcMain.handle('get-files-in-directory', async (e, rootPath:string, path: string) => {
    // Each time the client opens a directory, we give them the contents and we start watching the directory for updates.
    watchDirectory(rootPath, path)
    return await getFilesInDirectory(path)
  })

  ipcMain.handle('add-paths', async (_, paths: string[]) => {
    if (!paths || paths.length === 0) return
    const resolvedPaths = getResolvedPaths(paths)
    if (!resolvedPaths) return
    if (!rootPaths) rootPaths = []

    for (const rootPath of resolvedPaths) {
      if (rootPaths?.findIndex(p => p === rootPath) === -1) {
        rootPaths.unshift(rootPath)
      }
    }
  })
}

const watchDirectory = (rootPath: string, path: string): void => {
  if (!watchers[rootPath]) {
    watchers[rootPath] = chokidar.watch(path, { ignoreInitial: true, awaitWriteFinish: true, depth: 0 })
    watchers[rootPath].on('ready', () => {
      watchers[rootPath].on('all', async (_, updatedPath: string) => {
        // eslint-disable-next-line no-useless-escape
        const dirName = normalizePath(updatedPath.match(/(.*)[\/\\]/)![1] || '')
        const files = await getFilesInDirectory(dirName)
        window!.webContents.send('directory-updated', path, dirName, files)
      })
    })
  } else {
    watchers[rootPath].add(path)
  }
}

const getFilesInDirectory = async (path: string): Promise<DirectoryItem[] | null> => {
  try {
    const fileNamesInDirectory = await readdir(path)
    if (!path.endsWith('\\')) {
      path = path + '\\'
    }

    return fileNamesInDirectory.map(name => {
      const fullPath = `${path}${name}`
      const isDirectory = isPathADirectory(fullPath)

      const file: DirectoryItem = {
        path: normalizePath(fullPath),
        name,
        type: isDirectory ? 'directory' : 'file'
      }
      if (isDirectory) {
        file.children = []
      }
      return file
    })
  } catch (e) {
    // If we dont have permissions, or the path is not found, return null to tell the front end there was an error
    return null
  }
}
