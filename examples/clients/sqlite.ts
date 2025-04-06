import { ClientInterface, StatementRunOptions } from "@thequinndev/query-manager/manager/client.interface"
import Database from 'better-sqlite3';

const db = new Database('query-manager.db');

/** This client is used for unit testing */
export const sqliteClient = (): ClientInterface<Database.Database> => {

  const statementRun = async (options: StatementRunOptions) => {
    const { queryItem, parameters } = options

    const prepared = db.prepare(queryItem.query)

    const resolvedParams = queryItem.parameters?.arrayResolver(parameters)

    if (queryItem.meta.isSelect) {
        if (queryItem.meta.returnsOne) {
            const result = resolvedParams ? prepared.get(resolvedParams) : prepared.get()
            return result
        }

        if (queryItem.meta.returnsMany) {
            const result = resolvedParams ? prepared.all(resolvedParams) : prepared.all()
            return result
        }
    }

    const result = resolvedParams ? prepared.run(resolvedParams) : prepared.run()
    return result
    
  };

  return {
    client: db,
    statementRun,
  };
};
