import { QueryManager } from "@thequinndev/query-manager/manager";
import { ClientInterface, StatementRunOptions } from "@thequinndev/query-manager/manager/client.interface"
import { query, queryGroup, queryParameter } from "@thequinndev/query-manager/queries";
import pg from 'pg'
import { z } from "zod";
const { Client } = pg

/** This client is used for functional testing using docker */
const pgClient = (client: pg.Client): ClientInterface<pg.Client> => {

    const setClient = (_client: pg.Client) => {
        client = _client
    }

    const statementRun = async (options: StatementRunOptions) => {
        const { queryItem, parameters } = options
        const resolvedParams = queryItem.parameters?.arrayResolver(parameters)

        const result = resolvedParams ? client.query(queryItem.query, resolvedParams) : client.query(queryItem.query)

        const resolved = await result
        if (queryItem.meta.isFunction) {
            // For PG functions the result returns indexed by the function name as a tuple
            if (Array.isArray(resolved.rows)) {
                const functionResult = Object.values((resolved.rows[0] ?? {}))[0] ?? null
                return functionResult
            }
        }

        if (queryItem.meta.returnsOne) {
            return resolved.rows[0] ?? null 
        }
        
        return resolved.rows
    };

    return {
        client: client,
        setClient,
        statementRun,
    };
};

const userTableSchema = z.object({
    id: z.coerce.number().min(1).max(400000),
    name: z.string().min(1).max(50),
    description: z.string().max(1000),
    date_created: z.date().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/))
})

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'query-manager-user',
    password: 'query-manager-password', // 😱 a password? checked in??
    database: 'query-manager-db'
})

const userQueryManager = QueryManager({
    client: pgClient(client),
    queries: queryGroup([
        query({
            alias: 'insertViaFunctionWithRetrievalHandler',
            description: 'Insert single row via function for test. Returns the new ID.',
            query: 'select * from create_user($1, $2)',
            parameters: [
                queryParameter('name', userTableSchema.shape.name),
                queryParameter('description', userTableSchema.shape.description),
            ],
            returns: z.number(),
            onResultRetrieval: (result) => {
                const preSchema = z.tuple([z.object({
                    create_user: z.number()
                })])
                return preSchema.parse(result)[0].create_user
            }
        }),
        query({
            alias: 'insertViaFunctionWithQueryTypeProvided',
            queryType: 'Function',
            description: 'Insert single row via function for test. Returns the new ID.',
            query: 'select * from create_user($1, $2)',
            parameters: [
                queryParameter('name', userTableSchema.shape.name),
                queryParameter('description', userTableSchema.shape.description),
            ],
            returns: z.number(),
        }),
        query({
            alias: 'selectSingleTest',
            description: 'Select single row for test',
            query: 'select * from user_table where id = $1',
            parameters: [
                queryParameter('id', userTableSchema.shape.id)
            ],
            returns: userTableSchema
        }),
        query({
            alias: 'selectManyTest',
            description: 'Select many rows',
            query: 'select * from users',
            returns: userTableSchema.array()
        }),
        query({
            alias: 'deleteSingleTest',
            description: 'Delete single row for test',
            query: 'delete from users where id = $1',
            parameters: [
                queryParameter('id', userTableSchema.shape.id),
            ],
            returns: z.object({
                success: z.literal(true)
            }),
            onResultRetrieval: () => {
                return {
                    success: true
                }
            }
        }),
        query({
            alias: 'resetUserTableIdSequence',
            description: 'Reset the ID sequence',
            query: "SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false)",
            returns: z.tuple([ z.object({ setval: z.coerce.number() }) ])
        }),
        query({
            alias: 'selectIndividualColumns',
            description: 'Select only name and date',
            query: 'select name, date_created from users where id = $1',
            parameters: [
                queryParameter('id', userTableSchema.shape.id),
            ],
            returns: userTableSchema.omit({
                id: true,
                description: true,
            })
        }),
        query({
            alias: 'updateUserDescription',
            description: 'Update user description',
            query: 'update users set description = $1 where id = $2',
            parameters: [
                queryParameter('description', userTableSchema.shape.description),
                queryParameter('id', userTableSchema.shape.id),
            ],
            returns: z.object({
                success: z.literal(true)
            }),
            onResultRetrieval: () => {
                return {
                    success: true
                }
            }
        })
    ])
})

try {
    await userQueryManager.client.connect()
    await userQueryManager.client.query('BEGIN')

    console.log('Inserting a user')
    // Insert
    const id1 = await userQueryManager.run('insertViaFunctionWithRetrievalHandler', {
        name: 'test',
        description: 'test'
    })

    console.log('ID 1 retrieved: ', id1)

    console.log('Inserting another user')
    const id2 = await userQueryManager.run('insertViaFunctionWithQueryTypeProvided', {
        name: 'test',
        description: 'test'
    })

    console.log('ID 2 retrieved: ', id2)

    console.log('Selecting all from users')
    const selectManyTest = await userQueryManager.run('selectManyTest')
    console.log('There should be 2 results', selectManyTest)

    console.log('Deleting user with ID 2')
    const deleteResult = await userQueryManager.run('deleteSingleTest', {
        id: 2
    })
    console.log('And returned', deleteResult)

    console.log('Selecting all from users')
    const selectManyTest2 = await userQueryManager.run('selectManyTest')
    console.log('There should be 1 result', selectManyTest2)

    console.log('Selecting only name and date from user ID 1')
    const selectIndividualColumns = await userQueryManager.run('selectIndividualColumns', {
        id: 1
    })
    console.log('Result: ', selectIndividualColumns)

    console.log('Update description for user ID 1')
    const updateUserDescription = await userQueryManager.run('updateUserDescription', {
        description: 'new description',
        id: 1
    })
    console.log('Result: ', updateUserDescription)

    console.log('Resetting the sequence')
    const resetSequence = await userQueryManager.run('resetUserTableIdSequence')
    console.log('And returned ', resetSequence)

} catch (error) {
    console.log(error)
    console.log('If you continue to get unexpected errors, run pnpm pg:down then pnpm pg:up to reset the database.')
} finally {
    // rollback as this is just a test
    await userQueryManager.client.query('ROLLBACK')
    await userQueryManager.client.end()
}