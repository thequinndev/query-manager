import { ClientQueryItem } from '../queries'

export interface StatementRunOptions {
    queryItem: ClientQueryItem,
    parameters?: any
}

export interface ClientInterface<T> {
    client: T,
    setClient: (client: T) => void,
    statementRun: (options: StatementRunOptions) => Promise<any>
}