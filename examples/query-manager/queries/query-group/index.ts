import { queryGroup } from "@thequinndev/query-manager/queries";
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserNameAndDateById,
} from "../query-item";

export const userQueries = queryGroup([
  getAllUsers,
  getUserById,
  getUserNameAndDateById,
  createUser,
]);
