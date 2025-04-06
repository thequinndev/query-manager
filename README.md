# DB Manager

## Module Intent

[Read about it here](https://github.com/thequinndev/query-manager/blob/main/module-intent.md)

### Query Manager

The query manager utilities can be used to store queries relating to specific database entities. The queries can be in any format you like. See the `examples/query-manager` folder for a full working example.

#### Define your queries

- Query: - string - 'select \* from create_user($1, $2)' - The query you want to run
- Alias: - string - 'createUser' - The alias for this query
- Description - string - The description for this query - Used for documentation
- Parameters - Record<string, ZodAny>[] - The parameters in order of use. The array format helps maintain this order.
  - If a parameter is used twice declare it twice and it will be merged down into a single item (see Note on duplicate parameters below).
- Returns - ZodAny - The expected output data type schema.

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
    // Use the queryParameter helper function to create explicit single-key objects for your query parameters
    parameters: [
        queryParameter('name', userTableSchema.shape.name),
        queryParameter('description', description: userTableSchema.shape.description)
    ],
    returns: userTableSchema
})

// When you are ready to package your queries, you can put them in groups by a common entity
const userQueries = queryGroup([
    createUser
])
```

### Note on duplicate parameters

Hyphothetically if you need to use the same parameter twice in a query. For example here (bad example for demonstration only) where $1 and $2 will be the same user_id.

```sql
select * from my_table
where user_id = $1
AND user_id NOT IN (
  select user_id from my_table where user_id <> $2
)
```

In this instance you would declare the property twice and it will be merged down into one key in the function call. You need to declare all the values so every item in the array can be parameterized properly.

```typescript
const userIdParameter = queryParameter("id", userTableSchema.shape.id);

const queryThatWillNeverHappen = query({
  query: `select * from my_table
    where user_id = $1
    AND user_id NOT IN (
      select user_id from my_table where user_id <> $2
    )`,
  alias: "queryThatWillNeverHappen",
  description: "Just an example for merging keys",
  parameters: [userIdParameter, userIdParameter],
  returns: z.unknown(),
});
// userId only needs to be populated once
queryManager.run("queryThatWillNeverHappen", { userId: 1234 });
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
    parameterExample: {
        name: 'Richard Sanders',
        description: 'A valuable user.'
    },
    returnExample: {
        id: 1234,
        name: 'Richard Sanders',
        description: 'A valuable user.',
        date: '01/01/1970'
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
