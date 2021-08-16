export const noop = (args?: any) => {
}

let lastUniqueId = 0
export const getNextUniqueId = (): string => {
  lastUniqueId++

  return lastUniqueId.toString(10)
}
