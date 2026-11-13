import { graphql } from "@/shared/api/graphql/generated/gql"

export const LoginMutation = graphql(`
  mutation Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
    }
  }
`)

export const SignupMutation = graphql(`
  mutation Signup($auth: SignupInput!) {
    signup(auth: $auth) {
      access_token
      refresh_token
    }
  }
`)

export const ForgotPasswordMutation = graphql(`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`)

export const ResetPasswordMutation = graphql(`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`)

export const VerifyMailMutation = graphql(`
  mutation VerifyMail($mail: VerifyMailInput!) {
    verifyMail(mail: $mail)
  }
`)
