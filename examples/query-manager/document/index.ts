import { DocumentManager } from "@thequinndev/query-manager/document";
import { writeFileSync } from "fs";
import { userQueries } from "../queries/query-group";
import { fileURLToPath } from "url";
import path from "path";

const document = DocumentManager({
  queries: userQueries,
});

document.annotate("getAllUsers", {
  title: "Get all current users",
  returnExample: [
    {
      id: 1234,
      name: "Richard Sanders",
      description: "A valuable user.",
      date: "01/01/1970",
    },
    {
      id: 1235,
      name: "Karen Sanders",
      description: "A valuable user.",
      date: "01/01/1970",
    },
  ],
});

document.annotate("getUserById", {
  title: "Select user by ID",
  parameterExample: {
    id: 1234,
  },
  returnExample: {
    id: 1234,
    name: "Richard Sanders",
    description: "A valuable user.",
    date: "01/01/1970",
  },
});

document.annotate("getUserNameAndDateById", {
  title: "Select only user name and date by ID",
  parameterExample: {
    id: 1234,
  },
  returnExample: {
    name: "Richard Sanders",
    date: "01/01/1970",
  },
});

document.annotate("createUser", {
  title: "Create a new user",
  parameterExample: {
    name: "Richard Sanders",
    description: "A valuable user.",
  },
  returnExample: {
    id: 1234,
    name: "Richard Sanders",
    description: "A valuable user.",
    date: "01/01/1970",
  },
});

const doc = document.compile();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
writeFileSync(__dirname + "/doc.example.md", doc);
