import { addQueryItemMeta } from "../../../query-manager/utility/derive-meta";
import { z } from "zod";

export enum ParameterStrategy {
  KeyValue = 0,
  QuestionMark = 1,
  Ampersand = 2,
  Colon = 3,
  Dollar = 4,
}

export type QueryIntent = "Select" | "Insert" | "Update" | "Upsert" | "Delete";

export type QueryType = "BuiltQuery" | "Function" | "Procedure";

type SingleKeyRecord = Record<string, z.ZodType<any>>;
export type ParamSchemaBase = SingleKeyRecord[];

export type QueryDefinition<
  Description extends string,
  Alias extends string,
  QueryString extends string,
  Key extends string,
  ParameterSchema extends z.ZodType<any>,
  Parameter extends { [key in Key]: ParameterSchema },
  Parameters extends Parameter[],
  Returns extends z.ZodType<any>,
> = {
  intent?: QueryIntent;
  queryType?: QueryType;
  description?: Description;
  alias: Alias;
  query: QueryString;
  parameters?: Parameters;
  returns: Returns;
  onResultRetrieval?: (result: any) => any;
};

export type BaseQueryItem = QueryDefinition<
  string, // Description
  string, // Alias
  string, // QueryString
  string, // Key
  z.ZodType<any>, //ParameterSchema
  { [key in string]: z.ZodType<any> }, //Parameter
  { [key in string]: z.ZodType<any> }[],
  z.ZodType<any>
>;

export type QueryItemMeta = {
  isSelect: boolean;
  isInsert: boolean;
  isUpdate: boolean;
  isUpsert: boolean;
  isDelete: boolean;
  isFunction: boolean;
  isProcedure: boolean;
  isBuiltQuery: boolean;
  returnsOne: boolean;
  returnsMany: boolean;
  hasParameters: boolean;
};

export type QueryCollapsed<Query extends BaseQueryItem> = {
  description?: Query["description"];
  alias: Query["alias"];
  query: Query["query"];
  parameters?: QueryParametersCollapsed<Query["parameters"]>;
  returns: Query["returns"];
  meta: QueryItemMeta;
  onResultRetrieval?: (result: any) => any;
};

export type BaseCollapsedQueryItem = QueryCollapsed<BaseQueryItem>;
export type ClientQueryItem = BaseCollapsedQueryItem;

export type QueriesByAlias<Queries extends BaseCollapsedQueryItem[]> = {
  [K in Queries[number] as K["alias"]]: K;
};

export type GetQuery<
  QueryList extends QueriesByAlias<BaseCollapsedQueryItem[]>,
  Key extends keyof QueryList,
> = QueryList[Key] extends BaseCollapsedQueryItem ? QueryList[Key] : never;

export type QueryIn<
  T extends QueryParametersCollapsed<ParamSchemaBase> | undefined,
> =
  T extends QueryParametersCollapsed<ParamSchemaBase> ? T["collapsed"] : never;

export type QueryOut<QueryItem extends BaseCollapsedQueryItem> = z.infer<
  QueryItem["returns"]
>;

export type QueryParametersCollapsed<
  Parameters extends { [key in string]: z.ZodType<any> }[] | undefined,
> = Parameters extends { [key in string]: z.ZodType<any> }[]
  ? {
      collapsed: {
        [ParameterItemRecord in Parameters[number] extends infer ItemRecord
          ? ItemRecord extends { [key in infer Key]: infer Schema }
            ? Key extends string
              ? Schema extends z.ZodType<any>
                ? { key: Key; schema: z.input<Schema> }
                : never
              : never
            : never
          : never as ParameterItemRecord["key"]]: ParameterItemRecord["schema"];
      };
      original: Parameters;
      arrayResolver: (params: any) => any[];
      keyValueResolver: (params: any) => any;
    }
  : never;

const queryParameters = <
  Key extends string,
  Schema extends z.ZodType<any>,
  Parameter extends { [key in Key]: Schema },
  Parameters extends Parameter[],
>(
  parameters: Parameters,
) => {
  let index = 0;
  const indexMap: any = {};
  let finalSchema = z.object({});
  const collapsed = Object.fromEntries(
    parameters.map((record) => {
      const [key, schema] = Object.entries(record)[0] as [
        string,
        z.ZodType<any>,
      ];
      indexMap[index] = {
        key,
        schema,
      };
      finalSchema = finalSchema.extend({
        [key]: schema,
      });
      index++;
      return [key, schema._type];
    }),
  );

  const arrayResolver = (params: any) => {
    const finalParams: any[] = [];
    for (const ind in indexMap) {
      const key = indexMap[ind].key;
      const val = params[key];
      finalParams.push(indexMap[ind].schema.parse(val));
    }

    return finalParams;
  };

  const keyValueResolver = (params: any) => {
    return finalSchema.parse(params);
  };

  return {
    original: parameters,
    collapsed,
    arrayResolver,
    keyValueResolver,
  } as QueryParametersCollapsed<Parameters>;
};

export const query = <
  Description extends string,
  Alias extends string,
  QueryString extends string,
  Key extends string,
  ParameterSchema extends z.ZodType<any>,
  Parameter extends { [key in Key]: ParameterSchema },
  Parameters extends Parameter[],
  Returns extends z.ZodType<any>,
  QueryItem extends QueryDefinition<
    Description,
    Alias,
    QueryString,
    Key,
    ParameterSchema,
    Parameter,
    Parameters,
    Returns
  >,
>(
  query: QueryItem,
) => {
  const collapsedQuery = addQueryItemMeta(query) as QueryCollapsed<QueryItem>;
  collapsedQuery.parameters = query.parameters
    ? queryParameters(query.parameters)
    : undefined;
  return collapsedQuery;
};
