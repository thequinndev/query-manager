import { ClientQueryItem } from '../queries'

export interface ClientInterface<T> {
    client: T,
    statementRun: (queryItem: ClientQueryItem, parameters?: any) => Promise<any>
}