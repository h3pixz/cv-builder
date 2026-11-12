import { writeFile } from "node:fs/promises";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";

const endpoint = process.env.VITE_GRAPHQL_URL;

if (!endpoint) {
  throw new Error("VITE_GRAPHQL_URL is not configured");
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: getIntrospectionQuery(),
  }),
});

if (!response.ok) {
  throw new Error(`GraphQL request failed: ${response.status}`);
}

const result = await response.json();

if (result.errors?.length) {
  throw new Error(JSON.stringify(result.errors, null, 2));
}

if (!result.data?.__schema) {
  throw new Error("No GraphQL introspection data received");
}

const schema = buildClientSchema(result.data);

await writeFile("schema.graphql", printSchema(schema), "utf-8");

await writeFile(
  "introspectionSchema.full.json",
  JSON.stringify(result.data, null, 2),
  "utf-8",
);

console.log("GraphQL schema exported successfully");
