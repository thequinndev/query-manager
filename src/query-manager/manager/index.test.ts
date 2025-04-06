import { sqliteClient } from '@examples/clients/sqlite'
import { QueryManager } from '.'
import { query, queryGroup, queryParameter } from '../queries'
import { z } from 'zod'

const userTableSchema = z.object({
    id: z.coerce.number().min(1).max(400000),
    name: z.string().min(1).max(50),
    description: z.string().max(1000),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
})

describe('QueryManager', () => {
    const userQueryManager = QueryManager({
        client: sqliteClient(),
        queries: queryGroup([
            query({
                intent: 'Select',
                alias: 'selectSingleTest',
                description: 'Select single row for test',
                query: 'select * from user_table where id = ?',
                parameters: [
                    queryParameter('id', userTableSchema.shape.id)
                ],
                returns: userTableSchema
            }),
            query({
                intent: 'Insert',
                alias: 'insertSingleTest',
                description: 'Insert single row for test',
                query: 'insert into user_table (name, description, date) values (?, ?, ?)',
                parameters: [
                    queryParameter('name', userTableSchema.shape.name),
                    queryParameter('description', userTableSchema.shape.description),
                    queryParameter('date', userTableSchema.shape.date)
                ],
                returns: z.object({
                    changes: z.number(),
                    lastInsertRowid: z.number()
                })
            }),
            query({
                intent: 'Upsert',
                alias: 'upsertSingleTest',
                description: 'Upsert single row for test',
                query: 'insert or replace into user_table (id, name, description, date) values (?, ?, ?, ?)',
                parameters: [
                    queryParameter('id', userTableSchema.shape.id),
                    queryParameter('name', userTableSchema.shape.name),
                    queryParameter('description', userTableSchema.shape.description),
                    queryParameter('date', userTableSchema.shape.date)
                ],
                returns: z.object({
                    changes: z.number(),
                    lastInsertRowid: z.number()
                })
            }),
            query({
                intent: 'Delete',
                alias: 'deleteSingleTest',
                description: 'Delete single row for test',
                query: 'delete from user_table where id = ?',
                parameters: [
                    queryParameter('id', userTableSchema.shape.id),
                ],
                returns: z.object({
                    changes: z.number(),
                    lastInsertRowid: z.number()
                })
            }),
            query({
                intent: 'Select',
                alias: 'selectManyTest',
                description: 'Select many rows',
                query: 'select * from user_table',
                returns: userTableSchema.array()
            }),
            query({
                intent: 'Select',
                alias: 'selectWithDuplicateParameter',
                description: 'Select the same row using duplicate parameters',
                query: 'select * from user_table where id = ? and id = ? and id = ?',
                parameters: [
                    queryParameter('id', userTableSchema.shape.id),
                    queryParameter('id', userTableSchema.shape.id),
                    queryParameter('id', userTableSchema.shape.id),
                ],
                returns: userTableSchema
            }),
            query({
                intent: 'Select',
                alias: 'selectIndividualColumns',
                description: 'Select only name and date',
                query: 'select name, date from user_table where id = ?',
                parameters: [
                    queryParameter('id', userTableSchema.shape.id),
                ],
                returns: userTableSchema.omit({
                    id: true,
                    description: true,
                })
            })
        ])
    })

    beforeAll(async () => {
        const createTable = userQueryManager.client.prepare(`
            CREATE TABLE IF NOT EXISTS user_table (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              date TEXT NOT NULL
            )
        `);

        await createTable.run()
    })

    afterAll(async () => {
        const dropTable = userQueryManager.client.prepare(`
            DROP TABLE user_table
        `);

        await dropTable.run()
        await userQueryManager.client.close()

    })

    let id = 0;

    it('should perform the insert', async () => {

        const result = await userQueryManager.run('insertSingleTest', {
            name: 'test',
            description: 'test',
            date: '2025-04-05T14:30:00Z'
        })

        expect(result).toEqual({
            changes: 1,
            lastInsertRowid: 1
        })

        id = result.lastInsertRowid
    })

    it('should then select by the previous id', async () => {

        const result = await userQueryManager.run('selectSingleTest', {
            id: id as number
        })

        expect(result).toEqual({
            date: '2025-04-05T14:30:00Z',
            description: 'test',
            id: 1,
            name: 'test',
        })
    })

    it('should perform the upsert', async () => {

        const result = await userQueryManager.run('upsertSingleTest', {
            id: id,
            name: 'test-updated',
            description: 'test',
            date: '2025-04-05T14:30:00Z'
        })

        expect(result).toEqual({
            changes: 1,
            lastInsertRowid: 1
        })

        id = result.lastInsertRowid
    })

    it('should then select again by the previous id and return the updated name', async () => {

        const result = await userQueryManager.run('selectSingleTest', {
            id: id as number
        })

        expect(result).toEqual({
            date: '2025-04-05T14:30:00Z',
            description: 'test',
            id: 1,
            name: 'test-updated',
        })
    })

    it('should perform the deletion', async () => {

        const result = await userQueryManager.run('deleteSingleTest', {
            id
        })

        expect(result).toEqual({
            changes: 1,
            lastInsertRowid: 1
        })
    })


    it('should then fail to select the delete id', async () => {

        await expect(userQueryManager.run('selectSingleTest', {
            id: id as number
        })).rejects.toThrow()
    })

    it('will insert 3 unique rows then select them all', async () => {

        await userQueryManager.run('insertSingleTest', {
            name: 'test1',
            description: 'test1',
            date: '2025-04-05T14:30:00Z'
        })

        await userQueryManager.run('insertSingleTest', {
            name: 'test2',
            description: 'test2',
            date: '2025-04-05T14:30:00Z'
        })

        await userQueryManager.run('insertSingleTest', {
            name: 'test3',
            description: 'test3',
            date: '2025-04-05T14:30:00Z'
        })

        const result = await userQueryManager.run('selectManyTest')

        expect(result).toEqual([
            {
                "date": "2025-04-05T14:30:00Z",
                "description": "test1",
                "id": 2,
                "name": "test1",
            },
            {
                "date": "2025-04-05T14:30:00Z",
                "description": "test2",
                "id": 3,
                "name": "test2",
            },
            {
                "date": "2025-04-05T14:30:00Z",
                "description": "test3",
                "id": 4,
                "name": "test3",
            },
        ])
    })

    it('Will condense duplicate parameters to one input to the user', async () => {

        // id only needs to be declared once. It will map to id = ? and id = ? and id = ?
        const result = await userQueryManager.run('selectWithDuplicateParameter', {
            id: 2
        })

        expect(result).toEqual({
            "date": "2025-04-05T14:30:00Z",
            "description": "test1",
            "id": 2,
            "name": "test1",
        })
    })

    it('Will only return name and date', async () => {

        // id only needs to be declared once. It will map to id = ? and id = ? and id = ?
        const result = await userQueryManager.run('selectIndividualColumns', {
            id: 2
        })

        expect(result).toEqual(
            {
                "date": "2025-04-05T14:30:00Z",
                "name": "test1",
            },
        )
    })

    it('Will allow custom running of operations', async () => {

        const result = await userQueryManager.doOperationAsClient('selectIndividualColumns', ({
            client,
            queryItem,
            parameters,
            result,
        }) => {
            return result(client.prepare(queryItem.query).get(
                queryItem.parameters?.arrayResolver(parameters({
                    id: 2
                }))
            ))
        })

        expect(result).toEqual(
            {
                "date": "2025-04-05T14:30:00Z",
                "name": "test1",
            },
        )
    })
})