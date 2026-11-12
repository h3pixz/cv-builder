import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: [
    "src/features/**/*.{ts,tsx}",
    "src/shared/api/*.{ts,tsx}",
    "!src/shared/api/graphql/generated/**",
  ],
  generates: {
    "src/shared/api/graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
