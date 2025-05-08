import { operationGroup } from "@thequinndev/query-manager/operation-group";

import { userQueries } from "../query-manager/queries/query-group";

export const userQueryOperations = operationGroup(userQueries);
