# Query Manager

## Module Intent

[Read about it here](https://github.com/thequinndev/query-manager/blob/main/module-intent.md)

[Documentation](https://github.com/thequinndev/query-manager/wiki#query-manager-documentation)

### Query Manager

The query manager utilities can be used to store queries relating to specific database entities. The queries can be in any format you like. See the `examples/query-manager` folder for a full working example.

#### Define your queries

```typescript
import { z } from "zod";
import { query, queryGroup, queryParameter } from '@thequinndev/query-manager'

const userTableSchema = z.object({
    id: z.coerce.number().min(1).max(400000),
    name: z.string().min(1).max(50),
    description: z.string().max(1000),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
})

const createUser = query({
    query: 'select * from create_user($1, $2)',
    alias: 'createUser',
    description: 'Create a user',
    parameters: [
        queryParameter('name', userTableSchema.shape.name),
        queryParameter('description', description: userTableSchema.shape.description)
    ],
    returns: userTableSchema
})

const userQueries = queryGroup([
    createUser
])
```

### Document Manager

The document manager will accept your list of queries.

- Queries - Your list of queries.

```typescript
import { DocumentManager } from "@thequinndev/query-manager

const documentManager = DocumentManager({
    queries: userQueries // The queries we declared earlier
})

// You can also annotate your queries with additional fields if you want
documentManager.annotate('createUser', {
    title: 'Create a new user',
    parameters: {
        example: {
            name: 'Richard Sanders',
            description: 'A valuable user.'
        }
    },
    returns: {
        example: {
            id: 1234,
            name: 'Richard Sanders',
            description: 'A valuable user.',
            date: '01/01/1970'
        }
    }
})

// Compile the document
const doc = documentManager.compile()

// Write it to a file
writeFileSync(__dirname + '/doc.example.md', doc)
```

##### Document example

A document example that was generated using [DocumentManager](https://github.com/thequinndev/query-manager/tree/main/examples/query-manager/document/index.ts) is included [here](https://github.com/thequinndev/query-manager/tree/main/examples/query-manager/document/doc.example.md)

To generate it, run

```
pnpm run generate:example:db-doc
```

## Setup

### Install

```
pnpm install
```

### Tests

#### Unit

```
pnpm test
```

#### Coverage

```
pnpm coverage
```

#### Functional (postgres docker)

```
pnpm pg:up
```

Wait until up, then

```
pnpm pg:test
```

##### Reset

```
pnpm pg:down
```

##### Logs

```
pnpm pg:logs
```

## Fixes

### Issue

Unable to test due to this error with better-sqlite3

```
pnpm test
```

> Error: Could not locate the bindings file. Tried:

### Fix

```
npm rebuild better-sqlite3
```
