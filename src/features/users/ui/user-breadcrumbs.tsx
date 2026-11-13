import Link from "next/link";
import { notFound } from "next/navigation";
import { UserIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { getUser } from "../api/users.queries";

export async function UserBreadcrumbs({ userId }: { userId: string }) {
  const user = await getUser(userId);
  if (!user) notFound();

  const name =
    user.profile.full_name ||
    `${user.profile.first_name ?? ""} ${user.profile.last_name ?? ""}`.trim() ||
    user.email;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/users" />}>
            Employees
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href={`/users/${userId}/profile`} />}
            className="flex items-center gap-1 text-primary"
          >
            <UserIcon className="size-3.5" />
            {name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
