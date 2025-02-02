"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      style={{ backgroundColor: "#1537e8" }}
      type="submit"
      aria-disabled={pending}
      {...props}
    >
      {pending ? (
        <div className="loader"></div>
      ) : (
        children
      )}
    </Button>
  );
}
