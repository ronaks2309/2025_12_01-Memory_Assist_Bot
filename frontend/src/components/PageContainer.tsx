import type { PropsWithChildren } from "react";

interface PageContainerProps {
  className?: string;
}

export function PageContainer({
  children,
  className,
}: PropsWithChildren<PageContainerProps>) {
  const base = "flex-1 overflow-y-auto min-h-0 px-6 py-5";
  const classes = className ? `${base} ${className}` : base;
  return <section className={classes}>{children}</section>;
}
