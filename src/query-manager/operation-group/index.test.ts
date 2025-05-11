import { userQueryOperations } from "@examples/index";

describe("operationGroup", () => {
  it("should provide a Parameters helper", () => {
    const { Parameters } = userQueryOperations.query("createUser");
    expect(
      Parameters.arrayResolver({
        description: "test1",
        name: "test2",
      }),
    ).toEqual(["test2", "test1"]);

    expect(
      Parameters.keyValueResolver({
        description: "test1",
        name: "test2",
      }),
    ).toEqual({
      description: "test1",
      name: "test2",
    });
  });

  it("should provide a Parse helper", () => {
    const { Parse } = userQueryOperations.query("createUser");
    expect(() => Parse.returns(0)).toThrow();
  });

  it("should provide a returns helper", () => {
    const { returns } = userQueryOperations.query("createUser");

    expect(
      returns({
        id: 0,
        name: "test",
        date: "2025-04-05T14:30:00Z",
        description: "test",
      }),
    ).toEqual({
      id: 0,
      name: "test",
      date: "2025-04-05T14:30:00Z",
      description: "test",
    });
  });

  it("should provide the original query item", () => {
    const { QueryItem } = userQueryOperations.query("createUser");

    expect(QueryItem.query).toEqual("select * from create_user($1, $2)");

    expect(QueryItem.meta.returnsOne).toEqual(true);
  });
});
