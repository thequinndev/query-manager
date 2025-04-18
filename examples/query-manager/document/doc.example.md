## Get all current users [alias: getAllUsers]

> Get all users

```
select * from user_table
```

### Return Example

```
[
  {
    "id": 1234,
    "name": "Richard Sanders",
    "description": "A valuable user.",
    "date": "01/01/1970"
  },
  {
    "id": 1235,
    "name": "Karen Sanders",
    "description": "A valuable user.",
    "date": "01/01/1970"
  }
]
```

## Select user by ID [alias: getUserById]

> Get all columns by ID

```
select * from user_table where id = $1
```

### Parameters

#### $1 => id

- type: number
- min: 1
- max: 400000

### Invoke Example

```
queryManager.run('getUserById', {
  "id": 1234
})
```

### Return Example

```
{
  "id": 1234,
  "name": "Richard Sanders",
  "description": "A valuable user.",
  "date": "01/01/1970"
}
```

## Select only user name and date by ID [alias: getUserNameAndDateById]

> Get just name and date by ID

```
select name, date from user_table where id = $1
```

### Parameters

#### $1 => id

- type: number
- min: 1
- max: 400000

### Invoke Example

```
queryManager.run('getUserNameAndDateById', {
  "id": 1234
})
```

### Return Example

```
{
  "name": "Richard Sanders",
  "date": "01/01/1970"
}
```

## Create a new user [alias: createUser]

> Create a user

```
select * from create_user($1, $2)
```

### Parameters

#### $1 => name

- type: string
- min: 1
- max: 50

#### $2 => description

- type: string
- max: 1000

### Invoke Example

```
queryManager.run('createUser', {
  "name": "Richard Sanders",
  "description": "A valuable user."
})
```

### Return Example

```
{
  "id": 1234,
  "name": "Richard Sanders",
  "description": "A valuable user.",
  "date": "01/01/1970"
}
```
