import { BaseCollapsedQueryItem, QueriesByAlias } from "../query-item";

export const queryGroup = <Queries extends BaseCollapsedQueryItem[]>(
  queries: Queries,
) => {
  return queries.reduce((acc, item) => {
    //@ts-ignore
    acc[item.alias] = item;
    return acc;
  }, {}) as QueriesByAlias<Queries>;
};
