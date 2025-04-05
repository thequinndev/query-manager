import { queryParameter } from "@thequinndev/query-manager/queries";
import { userTableSchema } from "../../../schemas/tables/user-table";

// The query parameter function assists in asserting your query parameter as a single key object of your desired schema
export const userIdParameter = queryParameter('id', userTableSchema.shape.id)
export const userNameParameter = queryParameter('name', userTableSchema.shape.name)
export const userDescriptionParameter = queryParameter('description', userTableSchema.shape.description)