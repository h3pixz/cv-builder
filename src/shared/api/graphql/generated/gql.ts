/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.SignupDocument,
    "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n": typeof types.ResetPasswordDocument,
    "\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n": typeof types.VerifyMailDocument,
    "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.UpdateTokenDocument,
};
const documents: Documents = {
    "\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n": types.SignupDocument,
    "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n": types.ResetPasswordDocument,
    "\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n": types.VerifyMailDocument,
    "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n": types.UpdateTokenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n"): (typeof documents)["\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n"): (typeof documents)["\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n"): (typeof documents)["\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;