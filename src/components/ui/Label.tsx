import clsx from "clsx";
import React from "react";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx("text-sm text-gray-700 mb-1 inline-block", className)} {...props} />;
}


