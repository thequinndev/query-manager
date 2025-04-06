import {
  BaseCollapsedQueryItem,
  GetQuery,
  QueriesByAlias,
  QueryIn,
  QueryOut,
} from "../queries/query-item";
import { compileDataTypes } from "./process/compile-data-types";

type QueryAnnotation<T extends BaseCollapsedQueryItem> = {
    title?: string,
    parameterExample?: QueryIn<T['parameters']>,
    returnExample?: QueryOut<T>
}

export const DocumentManager = <
  Queries extends QueriesByAlias<BaseCollapsedQueryItem[]>,
>(config: {
  queries: Queries
}) => {
  const aliasMetadata: Record<string, QueryAnnotation<BaseCollapsedQueryItem>> = {};

  const annotate = <
    Alias extends keyof Queries,
    QueryItem extends GetQuery<Queries, Alias>,
  >(alias: Alias, annotation: QueryAnnotation<QueryItem>) => {
    aliasMetadata[alias as string] = annotation
  }

  const compile = () => {
    const aliasSections: string[] = []
    for (const queryAlias in config.queries) {
        const aliasSection: string[] = []
        const query = config.queries[queryAlias]
        const meta = aliasMetadata[queryAlias] ?? null
        const title = meta?.title ? `${meta?.title} ` : ''
        aliasSection.push(`## ${title}[alias: ${query.alias}]`)
        if (query.description) {
            aliasSection.push(`> ${query.description}`)
        }

        aliasSection.push(`### Query`)
        const dataTypes = compileDataTypes(query)
        if (dataTypes) {
            aliasSection.push(dataTypes)
        }

        aliasSection.push(`\`\`\`\n${query.query}\n\`\`\``)

        if (meta?.parameterExample) {
            aliasSection.push(`### Invoke Example`)
            aliasSection.push(`\`\`\`\nqueryManager.run('${query.alias}', ${JSON.stringify(meta.parameterExample, null, 2)})\n\`\`\``)
        }

        if (meta?.returnExample) {
            aliasSection.push(`### Return Example`)
            aliasSection.push(`\`\`\`\n${JSON.stringify(meta.returnExample, null, 2)}\n\`\`\``)
        }
        
        aliasSections.push(aliasSection.join('\n'))
    }

    return aliasSections.join('\n')
  };

  return {
    annotate,
    compile,
  };
};
