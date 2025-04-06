# Module Intent

The intent of this module is to support the maintenance and usage of queries used throughout a Typescript application. It attempts to "solve" a handful of problems that I personally wanted to solve for my own projects.

- Documenting queries
  - If there were any bespoke queries in my application I wanted to make sure I had oversight over them. A - So I wasn't creating duplicates & B - So I could review the queries easily.
  - Auto generation of documentation for my suite of queries so I don't have to write as much of it myself.
- Properly inferring the input and output data types for all queries (using zod) - even bespoke ones.
  - If I store zod schemas to use for my database queries I can tie them into other downstream things like APIs
  - I wanted to make raw sql queries type-safe - without needing to use a query builder.
- Simplified query calling
  - When I call a query I want to know exactly what I need to provide, what its data type is, and what I will get back.

Taking this postgres (pg) client function call as an example.

```typescript
const result = await client.query("select from update_user($1, $2, $3)", [
  1234,
  "Interesting new value",
  "",
]);
```

In calling these queries throughout my application, I found myself forgetting:

- What the parameters to my function were (and their data types) - All I was seeing was $1 $2 $3
- What data type is my function returning (is it string, boolean, json...)?
- Have I already implemented this?
