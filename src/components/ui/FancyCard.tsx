import React from "react";
import clsx from "clsx";

type FancyCardProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "blue" | "amber" | "purple" | "green" | "rose" | "slate";
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLDivElement>;

const toneToGradient: Record<NonNullable<FancyCardProps["tone"]>, string> = {
  blue: "from-blue-200 via-indigo-200 to-cyan-200",
  amber: "from-amber-200 via-yellow-200 to-orange-200",
  purple: "from-fuchsia-200 via-purple-200 to-indigo-200",
  green: "from-emerald-200 via-teal-200 to-lime-200",
  rose: "from-rose-200 via-pink-200 to-orange-200",
  slate: "from-slate-200 via-gray-200 to-zinc-200",
};

export function FancyCard({ children, className, tone = "slate", as = "div", ...rest }: FancyCardProps) {
  const Wrapper = (as || "div") as React.ElementType;
  return (
    <Wrapper
      className={clsx(
        "relative rounded-2xl p-[6px] transition hover:-translate-y-0.5 hover:shadow-xl",
        "bg-gradient-to-br",
        toneToGradient[tone],
        className
      )}
      {...rest}
    >
      <div className="rounded-2xl bg-white shadow-sm p-4">
        {children}
      </div>
    </Wrapper>
  );
}


