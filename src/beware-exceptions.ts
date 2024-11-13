/**
 * Exception boundary
 *
 * @param fn executable function
 * @param log if false, there will be no log on error captured
 */
export default function bewareExceptions<T>(fn: () => T, log = true): T | null {
  // Get named logger instance

  try {
    const response = fn()

    // Use async catch syntax if the executable returned async answer
    if (response instanceof Promise) {
      return response.catch(reason => {
        if (log) console.log(reason?.message ?? reason)

        return null
      }) as T
    }

    return response
  } catch (reason: any) {
    if (log) console.log(reason)

    return null
  }
}
