/**
 * Cast type to specific variable
 *
 * @param value variable
 */
export default function cast<T>(value: any): T {
  return value as any as T
}
