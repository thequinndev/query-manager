import { ClientInterface } from "./client.interface"
import { ClientQueryItem, GetQuery, QueriesByAlias, QueryIn, QueryOut } from "../queries"

export const QueryManager = <
    Queries extends QueriesByAlias<ClientQueryItem[]>,
    Client
>(config: {
    client: ClientInterface<Client>,
    queries: Queries
}) => {

    const run = async <
        Alias extends keyof Queries,
        QueryItem extends GetQuery<Queries, Alias>,
        In extends QueryIn<QueryItem['parameters']>,
        Out extends QueryOut<QueryItem>
    >(alias: Alias, parameters?: In): Promise<Out> => {
        const queryItem = config.queries[alias] as QueryItem
        const result = await config.client.statementRun(queryItem, parameters as any)

        // If onResultRetrieval has been declared then call it
        if (queryItem.onResultRetrieval) {
            queryItem.onResultRetrieval(result)
        }

        // Return the parsed result
        return queryItem.returns.parse(result)
    }

    const doOperationAsClient = async <
        Alias extends keyof Queries,
        QueryItem extends GetQuery<Queries, Alias>,
        In extends QueryIn<QueryItem['parameters']>,
        Out extends QueryOut<QueryItem>,
        Fn extends (
            input: {
                client: Client,
                queryItem: QueryItem,
                parameters: (params: In) => In,
                result: (resolve: unknown) => Out
            }
        ) => Out
    >(alias: Alias, fn: Fn) => {
        const queryItem = config.queries[alias] as QueryItem

        const result = (input: unknown): Out => {
            return input as Out
        }

        const parameters = <T>(input: T) => {
            return input
        }

        return queryItem.returns.parse(fn({
            client: config.client.client,
            queryItem: queryItem as QueryItem,
            result,
            parameters,
        }))
    }

    return {
        client: config.client.client,
        doOperationAsClient,
        run
    }
}