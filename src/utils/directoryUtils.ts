import fs from 'fs'

export const isPathADirectory = (path: string): boolean => {
  try {
    return fs.statSync(path).isDirectory()
  } catch (e) { return false }
}

export const normalizePath = (path: string): string => path.replaceAll('\\\\', '\\')
