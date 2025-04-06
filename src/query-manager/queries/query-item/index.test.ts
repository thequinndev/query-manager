import { createUser, tableSchemas } from "@examples/index";

describe("query", () => {
  it("should build and collapse the query into a usable form", () => {
    expect(createUser.alias).toEqual("createUser");
    expect(createUser.parameters?.original).toEqual([
      { name: tableSchemas.userTableSchema.shape.name },
      { description: tableSchemas.userTableSchema.shape.description },
    ]);

    // Collapsed is only used for type inference so it won't have any true value
    expect(createUser.parameters?.collapsed).toEqual({
      name: undefined,
      description: undefined,
    });

    // The array resolver converts the object to a resolved array and parses the output
    expect(
      createUser.parameters?.arrayResolver({
        name: "value1",
        description: "value2",
      }),
    ).toEqual(["value1", "value2"]);

    // The key value resolver simply parses the input
    expect(
      createUser.parameters?.keyValueResolver({
        name: "value1",
        description: "value2",
      }),
    ).toEqual({
      name: "value1",
      description: "value2",
    });
  });
});
