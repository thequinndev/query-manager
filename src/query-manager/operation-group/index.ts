import {
  ClientQueryItem,
  QueriesByAlias,
  QueryIn,
  QueryOut,
} from "@thequinndev/query-manager/queries";

export const operationGroup = <
  Queries extends QueriesByAlias<ClientQueryItem[]>,
>(
  queries: Queries,
) => {
  const query = <
    QueryAlias extends keyof Queries,
    QueryItem extends Queries[QueryAlias],
  >(
    alias: QueryAlias,
  ) => {
    const queryItem = queries[alias];

    return {
      Parameters: {
        arrayResolver: (input: QueryIn<QueryItem["parameters"]>) =>
          queryItem.parameters?.arrayResolver(input),
        keyValueResolver: (input: QueryIn<QueryItem["parameters"]>) =>
          queryItem.parameters?.keyValueResolver(input),
      },
      Parse: {
        returns: queryItem.returns.parse,
      },
      QueryItem: queryItem,
      returns: <Returns extends QueryOut<QueryItem>>(returns: Returns) =>
        returns,
    };
  };

  return {
    query,
  };
};
