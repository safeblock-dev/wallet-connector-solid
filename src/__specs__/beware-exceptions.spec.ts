import bewareExceptions from "../beware-exceptions"

describe("Utils / BewareExceptions", () => {
  it("should correctly process synchronous exceptions", () => {
    expect(
      bewareExceptions(() => {
        throw new Error("Some exception")
      }, false)
    ).toEqual(null)
  })

  it("should correctly process promise rejections", async () => {
    expect(
      await bewareExceptions(async () => {
        await new Promise<null>((_, reject) => {
          reject("Some exception")
        })

        return true
      }, false)
    ).toEqual(null)
  })

  it("should correctly process asynchronous exceptions", async () => {
    expect(
      await bewareExceptions(async () => {
        await new Promise(r => setTimeout(r, 100))

        if (1 === 1) throw new Error("Some exception")

        return true
      }, false)
    ).toEqual(null)
  })
})
