import clsx from "clsx";
import React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("rounded-xl border bg-white", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-4 border-b bg-gradient-to-r from-white to-gray-50", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={clsx("text-lg font-semibold tracking-tight", className)} {...props} />;
}


