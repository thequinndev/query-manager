import { BaseQueryItem, QueryCollapsed, QueryItemMeta } from "../queries";
import { schemaIs } from "./schema-is";

export const addQueryItemMeta = (
  queryItem: BaseQueryItem,
): QueryCollapsed<BaseQueryItem> => {
  const returnsOne = schemaIs.object(queryItem.returns);
  const returnsMany = schemaIs.array(queryItem.returns);

  const meta: QueryItemMeta = {
    isSelect: queryItem.intent === "Select",
    isInsert: queryItem.intent === "Insert",
    isUpdate: queryItem.intent === "Update",
    isUpsert: queryItem.intent === "Upsert",
    isDelete: queryItem.intent === "Delete",
    isFunction: queryItem.queryType === "Function",
    isProcedure: queryItem.queryType === "Procedure",
    isBuiltQuery: queryItem.queryType === "BuiltQuery",
    returnsOne,
    returnsMany,
    hasParameters: queryItem.parameters
      ? queryItem.parameters.length > 0
      : false,
  };

  //@ts-ignore
  queryItem.meta = meta;

  return queryItem as QueryCollapsed<BaseQueryItem>;
};
