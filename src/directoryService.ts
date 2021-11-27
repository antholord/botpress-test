import { DirectoryItem } from './models/directory'
import chokidar from 'chokidar'
import { BrowserWindow, ipcMain } from 'electron'
import fs from 'fs'
import util from 'util'
import { resolve } from 'path'
import { isPathADirectory, normalizePath } from './utils/directoryUtils'

const readdir = util.promisify(fs.readdir)

const getResolvedPaths = () : string[] | null => {
  const pathParams = process.argv.slice(2)
  if (pathParams.length === 0) return null
  return pathParams.map(path => normalizePath(resolve(path)))
}

export const SetupEvents = () : void => {
  const resolvedPaths = getResolvedPaths()
  ipcMain.on('get-paths', (e) => {
    e.returnValue = resolvedPaths
  })
  ipcMain.handle('get-files-in-directory', async (e, path: string) => {
    return await getFilesInDirectory(path)
  })
}

export const ProcessDirectories = (window: BrowserWindow): void => {
  const paths = getResolvedPaths()
  if (!paths) return
  let watchersReady = 0
  for (const path of paths) {
    const watcher = chokidar.watch(path, { ignoreInitial: true, awaitWriteFinish: true, depth: 20 })

    watcher.on('ready', () => {
      watchersReady++
      if (watchersReady === paths.length) {
        window.webContents.send('watcher-ready')
      }
      watcher.on('all', async (_, updatedPath: string) => {
        // eslint-disable-next-line no-useless-escape
        const dirName = normalizePath(updatedPath.match(/(.*)[\/\\]/)![1] || '')
        const files = await getFilesInDirectory(dirName)
        window.webContents.send('directory-updated', path, dirName, files)
      })
    })
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
    // If we dont have permissions, or the path is not found, return null to signal the front end
    return null
  }
}
