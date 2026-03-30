import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attend.AI - System Setup",
  description: "Initial system onboarding and configuration",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-surface text-on-surface antialiased flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
