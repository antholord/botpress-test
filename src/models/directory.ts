
export type DirectoryItem = {
    path: string
    name: string
    type: string
    children?: DirectoryItem[]
}
