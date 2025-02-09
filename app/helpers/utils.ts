export default class Utils {
  static omit = <T, Key extends keyof T>(obj: T, keys: Key[]): Omit<T, Key> => {
    const clone = { ...obj }
    keys.forEach((key) => delete clone[key])
    return clone
  }

  static pick = <T, Key extends keyof T>(obj: T, keys: Key[]): Pick<T, Key> => {
    const selected: Partial<T> = {}
    keys.forEach((key) => {
      selected[key] = obj[key]
    })
    return selected as Pick<T, Key>
  }
}
