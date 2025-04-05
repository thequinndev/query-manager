import { BaseQueryItem, QueryCollapsed, QueryIntent, QueryItemMeta } from "../queries";
import { schemaIs } from './schema-is'

export const addQueryItemMeta = (queryItem: BaseQueryItem): QueryCollapsed<BaseQueryItem> => {

    const returnsOne = schemaIs.object(queryItem.returns)
    const returnsMany = schemaIs.array(queryItem.returns)

    const meta: QueryItemMeta = {
        isSelect: queryItem.intent === QueryIntent.Select,
        isInsert: queryItem.intent === QueryIntent.Insert,
        isUpdate: queryItem.intent === QueryIntent.Update,
        isUpsert: queryItem.intent === QueryIntent.Upsert,
        isDelete: queryItem.intent === QueryIntent.Delete,
        returnsOne,
        returnsMany,
        hasParameters: queryItem.parameters ? queryItem.parameters.length > 0 : false
    }

    //@ts-ignore
    queryItem.meta = meta

    return queryItem  as QueryCollapsed<BaseQueryItem>
}