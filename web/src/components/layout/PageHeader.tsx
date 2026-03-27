"use client";

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, breadcrumb, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between px-6 pt-6 pb-2">
      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: "'Nunito', sans-serif", color: "var(--color-primary)" }}
        >
          {title}
        </h2>
        <div className="flex items-center gap-1 text-sm mt-0.5">
          <span style={{ color: "var(--color-muted)" }}>Home</span>
          <span style={{ color: "var(--color-muted)" }}>/</span>
          <span style={{ color: "var(--color-body)" }}>{breadcrumb || title}</span>
        </div>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
