import { DocumentManager } from ".";
import { query, queryGroup, queryParameter } from "../queries";
import { z } from "zod";

const annotateMockManager = <T extends any>(manager: T) => {
  (manager as any).annotate("mockDbQueryTest", {
    title: "Mock",
    parameterExample: {
      id: 1234,
    },
    returnExample: 5678,
  });
  return manager;
};

describe("DocumentManager", () => {
  it("should build a README document with examples", () => {
    const manager = annotateMockManager(
      DocumentManager({
        queries: queryGroup([
          query({
            alias: "mockDbQueryTest",
            description: "Just a test for a mock",
            query: "select * from any where id = ?",
            parameters: [queryParameter("id", z.number())],
            returns: z.number(),
          }),
        ]),
      }),
    );

    const result = manager.compile();

    const expected: string[] = [
      "## Mock [alias: mockDbQueryTest]",
      "> Just a test for a mock",
      "### Query",
      "* id",
      "\t* type: number",
      "```",
      "select * from any where id = ?",
      "```",
      "### Invoke Example",
      "```",
      "queryManager.run('mockDbQueryTest', {",
      '  "id": 1234',
      "})",
      "```",
      "### Return Example",
      "```",
      "5678",
      "```",
    ];

    expect(result).toEqual(expected.join("\n"));
  });
});
