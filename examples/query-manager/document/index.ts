import { DocumentManager } from "@thequinndev/query-manager/document";
import { writeFileSync } from "fs";
import { userQueries } from "../queries/query-group";

const document = DocumentManager({
  queries: userQueries,
});

document.annotate("getAllUsers", {
  title: "Get all current users",
  returns: {
    example: [
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
  },
});

document.annotate("getUserById", {
  title: "Select user by ID",
  parameters: {
    example: {
      id: 1234,
    },
  },
  returns: {
    example: {
      id: 1234,
      name: "Richard Sanders",
      description: "A valuable user.",
      date: "01/01/1970",
    },
  },
});

document.annotate("getUserNameAndDateById", {
  title: "Select only user name and date by ID",
  parameters: {
    example: {
      id: 1234,
    },
  },
  returns: {
    example: {
      name: "Richard Sanders",
      date: "01/01/1970",
    },
  },
});

document.annotate("createUser", {
  title: "Create a new user",
  parameters: {
    example: {
      name: "Richard Sanders",
      description: "A valuable user.",
    },
  },
  returns: {
    example: {
      id: 1234,
      name: "Richard Sanders",
      description: "A valuable user.",
      date: "01/01/1970",
    },
  },
});

const doc = document.compile();

writeFileSync("./examples/query-manager/document/doc.example.md", doc);
