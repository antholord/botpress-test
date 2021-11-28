import fs from 'fs'
import { resolve, join } from 'path'
import { homedir } from 'os'

export const isPathADirectory = (path: string): boolean => {
  try {
    return fs.statSync(path).isDirectory()
  } catch (e) { return false }
}

export const normalizePath = (path: string): string => path.replaceAll('\\\\', '\\')

export const getCmdArgumentPaths = (): string[] | null => getResolvedPaths(process.argv.slice(2))

export const getResolvedPaths = (paths: string[]) : string[] => {
  if (paths.length === 0) return []
  return paths.map(path => normalizePath(resolve(resolveHomeDir(path))))
}

const resolveHomeDir = (path: string): string => {
  if (path === '~') return homedir()
  if (path.slice(0, 2) !== '~/') return path
  return join(homedir(), path.slice(2))
}
