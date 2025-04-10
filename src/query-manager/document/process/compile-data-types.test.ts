import { z } from "zod";
import { query, queryParameter } from "../../queries";
import { compileDataTypes } from "./compile-data-types";

describe("compileDataTypes", () => {
  it("should compile a $1 style query", () => {
    const queryItem = query({
      alias: "mockDbQueryTest",
      description: "Just a test for a mock",
      query: "select * from any where id = $1",
      parameters: [queryParameter("id", z.number())],
      returns: z.number(),
    });

    const result = compileDataTypes(queryItem);

    const resultArray = [`### Parameters `, `#### $1 => id`, `* type: number`];

    expect(result).toEqual(resultArray.join("\n"));
  });

  it("should compile a :param style query", () => {
    const queryItem = query({
      alias: "mockDbQueryTest",
      description: "Just a test for a mock",
      query: "select * from any where id = :id",
      parameters: [queryParameter("id", z.number())],
      returns: z.number(),
    });

    const result = compileDataTypes(queryItem);

    const resultArray = [`### Parameters `, `#### :id => id`, `* type: number`];

    expect(result).toEqual(resultArray.join("\n"));
  });
});
