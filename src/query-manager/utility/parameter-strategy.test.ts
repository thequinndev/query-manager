import { z } from "zod";
import { query, queryParameter } from "../queries";
import { collectParameters } from "./parameter-strategy";

describe("collectParameters", () => {
  it("should collect for $", () => {
    const item = query({
      alias: "any",
      description: "any",
      parameters: [
        queryParameter("test1", z.string()),
        queryParameter("test2", z.string()),
        queryParameter("test3", z.string()),
      ],
      query:
        "select * from anything where id = $1 and other = $2 and something_else = $3",
      returns: z.any(),
    });

    const result = collectParameters(item);

    expect(result).toEqual(["$1", "$2", "$3"]);
  });
  it("should collect for :", () => {
    const item = query({
      alias: "any",
      description: "any",
      parameters: [
        queryParameter("test_1", z.string()),
        queryParameter("test2", z.string()),
        queryParameter("test3", z.string()),
      ],
      query:
        "select * from anything where id = :test_1 and other = :test2 and something_else = :test3",
      returns: z.any(),
    });

    const result = collectParameters(item);

    expect(result).toEqual([":test_1", ":test2", ":test3"]);
  });

  it("should collect for &", () => {
    const item = query({
      alias: "any",
      description: "any",
      parameters: [
        queryParameter("test_1", z.string()),
        queryParameter("test2", z.string()),
        queryParameter("test3", z.string()),
      ],
      query:
        "select * from anything where id = &test_1 and other = &test2 and something_else = &test3",
      returns: z.any(),
    });

    const result = collectParameters(item);

    expect(result).toEqual(["&test_1", "&test2", "&test3"]);
  });

  it("should collect for ?", () => {
    const item = query({
      alias: "any",
      description: "any",
      parameters: [
        queryParameter("test_1", z.string()),
        queryParameter("test2", z.string()),
        queryParameter("test3", z.string()),
      ],
      query:
        "select * from anything where id = ? and other = ? and something_else = ?",
      returns: z.any(),
    });

    const result = collectParameters(item);

    expect(result).toEqual(["?", "?", "?"]);
  });
});
