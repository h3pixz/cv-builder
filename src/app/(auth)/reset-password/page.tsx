import { ResetPasswordPage } from "@/features/auth"

export const instant = false

type ResetPasswordRouteProps = {
  searchParams: Promise<{ token?: string | string[] }>
}

export default async function Page({ searchParams }: ResetPasswordRouteProps) {
  const { token } = await searchParams

  return (
    <ResetPasswordPage token={typeof token === "string" ? token : undefined} />
  )
}
