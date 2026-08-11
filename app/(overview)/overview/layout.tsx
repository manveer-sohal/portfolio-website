import type { ReactNode } from "react";
import { OverviewHeader } from "@/components/overview/OverviewHeader";
import "../overview.css";

export default function OverviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="overview-root">
      <OverviewHeader />
      {children}
    </div>
  );
}
