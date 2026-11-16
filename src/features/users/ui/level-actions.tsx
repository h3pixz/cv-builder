import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function LevelActions({
  addLabel,
  removeLabel,
}: {
  addLabel: string;
  removeLabel: string;
}) {
  // TODO: wire up when a dialog component and the add/delete actions exist
  return (
    <div className="mt-10 flex justify-center gap-10">
      <Button variant="ghost" disabled>
        <PlusIcon className="size-4" />
        {addLabel}
      </Button>
      <Button variant="default" disabled>
        <Trash2Icon className="size-4" />
        {removeLabel}
      </Button>
    </div>
  );
}
