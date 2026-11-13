import { graphql } from "@/shared/api/graphql/generated/gql";

export const UpdateTokenDocument = graphql(`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`);
