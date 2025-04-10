## Get all current users [alias: getAllUsers]

> Get all users

```
select * from user_table
```

## Select user by ID [alias: getUserById]

> Get all columns by ID

### Parameters

#### $1 => id

- type: number
- min: 1
- max: 400000

```
select * from user_table where id = $1
```

## Select only user name and date by ID [alias: getUserNameAndDateById]

> Get just name and date by ID

### Parameters

#### $1 => id

- type: number
- min: 1
- max: 400000

```
select name, date from user_table where id = $1
```

## Create a new user [alias: createUser]

> Create a user

### Parameters

#### $1 => name

- type: string
- min: 1
- max: 50

#### $2 => description

- type: string
- max: 1000

```
select * from create_user($1, $2)
```
