import { SignInPage } from "@/features/auth"

export const instant = false

type SignInRouteProps = {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function Page({ searchParams }: SignInRouteProps) {
  const { next } = await searchParams

  return <SignInPage next={typeof next === "string" ? next : undefined} />
}
