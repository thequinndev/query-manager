import { query } from "@thequinndev/query-manager/queries";
import { userTableSchema } from "../../../schemas/tables/user-table";
import {
  userDescriptionParameter,
  userIdParameter,
  userNameParameter,
} from "../query-parameter";

export const getAllUsers = query({
  query: "select * from user_table",
  alias: "getAllUsers",
  description: "Get all users",
  returns: userTableSchema.array(),
});

export const getUserById = query({
  query: "select * from user_table where id = $1",
  alias: "getUserById",
  description: "Get all columns by ID",
  parameters: [
    userIdParameter, // This will express as {id: number}
  ],
  returns: userTableSchema,
});

export const getUserNameAndDateById = query({
  query: "select name, date from user_table where id = $1",
  alias: "getUserNameAndDateById",
  description: "Get just name and date by ID",
  parameters: [
    userIdParameter, // This will express as {id: number}
  ],
  returns: userTableSchema.pick({ name: true, date: true }),
});

export const createUser = query({
  query: "select * from create_user($1, $2)",
  alias: "createUser",
  description: "Create a user",
  parameters: [
    userNameParameter, // This will express as {name: string, description: string}
    userDescriptionParameter,
  ],
  returns: userTableSchema,
});
