export interface IgnoreListRef {
  add: (value: string) => any
  has: (value: string) => boolean
  delete: (value: string) => any
}
