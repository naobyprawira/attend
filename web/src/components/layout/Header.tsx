export function Header() {
  return (
    <header className="h-[60px] bg-white flex items-center justify-between px-5 shrink-0"
      style={{ boxShadow: "var(--shadow-header)" }}>
      <div className="flex items-center gap-2">
        <h1 className="text-[26px] font-bold" style={{ fontFamily: "'Nunito', sans-serif", color: "var(--color-heading)" }}>
          Attend.ai
        </h1>
      </div>
      <div className="flex items-center gap-5">
        {/* Notification bell */}
        <button className="relative p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#899bbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        {/* System status */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--color-heading)" }}>System</span>
        </div>
      </div>
    </header>
  );
}
