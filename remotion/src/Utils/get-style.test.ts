import { describe, it, expect } from "vitest"
import { getStyle, parseStyleString } from "./getStyle"

describe("parseStyleString", () => {
  it("parses a simple CSS string", () => {
    expect(parseStyleString("font-size:12px; color:red;")).toEqual({
      fontSize: "12px",
      color: "red",
    })
  })

  it("parses kebab-case properties", () => {
    expect(
      parseStyleString("background-color:blue; border-radius:4px;"),
    ).toEqual({ backgroundColor: "blue", borderRadius: "4px" })
  })

  it("ignores empty or malformed rules", () => {
    expect(parseStyleString("font-size:12px;;:;color:blue")).toEqual({
      fontSize: "12px",
      color: "blue",
    })
  })

  it("returns empty object for empty string", () => {
    expect(parseStyleString("")).toEqual({})
  })
})

describe("getStyle", () => {
  it("returns baseStyle if userStyle is undefined", () => {
    expect(getStyle(undefined, { color: "red" })).toEqual({ color: "red" })
  })

  it("merges baseStyle and userStyle string", () => {
    expect(
      getStyle("font-size:12px; color:blue;", { color: "red", margin: "2px" }),
    ).toEqual({ color: "blue", margin: "2px", fontSize: "12px" })
  })

  it("merges baseStyle and userStyle object", () => {
    expect(
      getStyle(
        { color: "blue", fontWeight: "bold" },
        { color: "red", margin: "2px" },
      ),
    ).toEqual({ color: "blue", margin: "2px", fontWeight: "bold" })
  })

  it("returns userStyle object if baseStyle is empty", () => {
    expect(getStyle({ color: "blue" }, {})).toEqual({ color: "blue" })
  })

  it("returns parseStyleString(userStyle) if baseStyle is empty and userStyle is string", () => {
    expect(getStyle("color:blue;", {})).toEqual({ color: "blue" })
  })

  it("userStyle properties override baseStyle", () => {
    expect(getStyle("color:blue;", { color: "red", fontSize: "10px" })).toEqual(
      { color: "blue", fontSize: "10px" },
    )
    expect(
      getStyle({ color: "blue" }, { color: "red", fontSize: "10px" }),
    ).toEqual({ color: "blue", fontSize: "10px" })
  })
})
