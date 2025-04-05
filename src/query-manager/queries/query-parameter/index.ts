import { z } from "zod"

export const queryParameter = <
Key extends string,
Schema extends z.ZodType<any>,
>(key: Key, parameter: Schema) => {
  return {[key]: parameter} as {[key in Key]: Schema}
}