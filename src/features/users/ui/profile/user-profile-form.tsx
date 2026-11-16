// profile/user-profile-form.tsx (client)
"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

type Props = {
  isVerified: boolean;
  values: {
    firstName: string;
    lastName: string;
    department: string;
    position: string;
  };
};

function Field({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[10px] text-muted-foreground">
        {label}
      </Label>
      <Input id={id} name={id} defaultValue={value} readOnly />
    </div>
  );
}

export function UserProfileForm({ values, isVerified }: Props) {
  return (
    <form className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field id="firstName" label="First Name" value={values.firstName} />
        <Field id="lastName" label="Last Name" value={values.lastName} />
        <Field id="department" label="Department" value={values.department} />
        <Field id="position" label="Position" value={values.position} />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" disabled={isVerified}>
          Verify email
        </Button>
        <Button type="submit" variant="primary" disabled>
          Update
        </Button>
      </div>
    </form>
  );
}
