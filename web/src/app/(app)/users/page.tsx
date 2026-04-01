"use client";

import { useState } from "react";

/* ── Types ── */
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleBadge: string;
  lastActive: string;
  status: "Active" | "Suspended" | "Pending";
  avatar: string;
  sessions: number;
  trustScore: number;
}

/* ── Dummy data ── */
const USERS: User[] = [
  { id: 1, name: "Marcus Chen", email: "m.chen@attend.ai", role: "Super Admin", roleBadge: "bg-primary/10 text-primary", lastActive: "2 minutes ago", status: "Active", avatar: "MC", sessions: 84, trustScore: 99.1 },
  { id: 2, name: "Elena Rodriguez", email: "e.rodriguez@attend.ai", role: "Security Lead", roleBadge: "bg-tertiary/10 text-tertiary", lastActive: "14 minutes ago", status: "Active", avatar: "ER", sessions: 67, trustScore: 98.4 },
  { id: 3, name: "Sarah Jenkins", email: "s.jenkins@attend.ai", role: "HR Manager", roleBadge: "bg-secondary/10 text-secondary", lastActive: "1 hour ago", status: "Active", avatar: "SJ", sessions: 52, trustScore: 97.2 },
  { id: 4, name: "Amara Okafor", email: "a.okafor@attend.ai", role: "Analyst", roleBadge: "bg-on-surface-variant/10 text-on-surface-variant", lastActive: "3 hours ago", status: "Active", avatar: "AO", sessions: 41, trustScore: 96.8 },
  { id: 5, name: "James Miller", email: "j.miller@attend.ai", role: "Workspace", roleBadge: "bg-on-surface-variant/10 text-on-surface-variant", lastActive: "1 day ago", status: "Suspended", avatar: "JM", sessions: 12, trustScore: 72.3 },
  { id: 6, name: "Lisa Wong", email: "l.wong@attend.ai", role: "Analyst", roleBadge: "bg-on-surface-variant/10 text-on-surface-variant", lastActive: "5 hours ago", status: "Active", avatar: "LW", sessions: 38, trustScore: 95.0 },
  { id: 7, name: "David Park", email: "d.park@attend.ai", role: "Security Lead", roleBadge: "bg-tertiary/10 text-tertiary", lastActive: "30 minutes ago", status: "Active", avatar: "DP", sessions: 59, trustScore: 98.9 },
  { id: 8, name: "Nina Petrova", email: "n.petrova@attend.ai", role: "Workspace", roleBadge: "bg-on-surface-variant/10 text-on-surface-variant", lastActive: "2 days ago", status: "Pending", avatar: "NP", sessions: 3, trustScore: 80.1 },
];

const TABS = ["All Users", "Active", "Suspended"] as const;

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All Users");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "All Users" ||
      u.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalActive = USERS.filter((u) => u.status === "Active").length;
  const totalSessions = USERS.reduce((sum, u) => sum + u.sessions, 0);
  const avgTrust =
    USERS.reduce((sum, u) => sum + u.trustScore, 0) / USERS.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-surface dark:bg-dark-surface min-h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-secondary-fixed dark:text-dark-on-surface tracking-tight">
            User Management
          </h2>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-2 font-medium text-sm">
            Configure and audit enterprise access privileges.
          </p>
        </div>
        <button className="primary-gradient text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm self-start sm:self-auto">
          <span className="material-symbols-outlined text-sm">add</span>
          Add User
        </button>
      </div>

      {/* Search + filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or organization..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface dark:text-dark-on-surface"
          />
        </div>
        <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-surface-container-lowest dark:bg-dark-surface-container-lowest text-on-surface dark:text-dark-on-surface shadow-sm"
                  : "text-on-surface-variant dark:text-dark-on-surface-variant hover:text-on-surface dark:hover:text-dark-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant border-b border-outline-variant/10">
                <th className="px-6 py-4">User</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4 hidden sm:table-cell">Email</th>
                <th className="px-4 py-4 hidden lg:table-cell">Last Active</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-outline-variant/5 hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors"
                >
                  {/* User cell */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.avatar}
                      </div>
                      <span className="font-semibold text-on-surface dark:text-dark-on-surface whitespace-nowrap">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${user.roleBadge}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  {/* Email */}
                  <td className="px-4 py-4 hidden sm:table-cell text-on-surface-variant dark:text-dark-on-surface-variant text-xs">
                    {user.email}
                  </td>
                  {/* Last Active */}
                  <td className="px-4 py-4 hidden lg:table-cell text-on-surface-variant dark:text-dark-on-surface-variant text-xs whitespace-nowrap">
                    {user.lastActive}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        user.status === "Active"
                          ? "text-green-500"
                          : user.status === "Suspended"
                          ? "text-error"
                          : "text-amber-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-green-500"
                            : user.status === "Suspended"
                            ? "bg-error"
                            : "bg-amber-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <button className="p-1.5 hover:bg-surface-container dark:hover:bg-dark-surface-container-high rounded-lg transition-all text-on-surface-variant dark:text-dark-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
              Showing {(currentPage - 1) * perPage + 1}&ndash;
              {Math.min(currentPage * perPage, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-surface-container dark:hover:bg-dark-surface-container disabled:opacity-30 transition-all text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-surface-container dark:hover:bg-dark-surface-container disabled:opacity-30 transition-all text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Growth card */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-green-500 text-lg">
              trending_up
            </span>
            <span className="text-green-500 text-xs font-bold">+12.4%</span>
          </div>
          <p className="text-2xl font-extrabold text-on-surface dark:text-dark-on-surface">
            {totalActive}
          </p>
          <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest font-bold mt-1">
            Active Users This Month
          </p>
        </div>

        {/* Sessions card */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-lg">
              devices
            </span>
          </div>
          <p className="text-2xl font-extrabold text-on-surface dark:text-dark-on-surface">
            {totalSessions}
          </p>
          <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest font-bold mt-1">
            Total Sessions (30d)
          </p>
        </div>

        {/* Trust Score - dark card */}
        <div className="bg-dark-surface-container dark:bg-dark-surface-container rounded-2xl p-6 border border-outline-variant/5">
          <p className="text-[10px] text-dark-on-surface-variant uppercase tracking-widest font-bold mb-2">
            Avg. Trust Score
          </p>
          <p className="text-4xl font-extrabold text-white">
            {avgTrust.toFixed(1)}
          </p>
          <div className="mt-3 h-1.5 bg-dark-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${avgTrust}%` }}
            />
          </div>
          <p className="text-[10px] text-dark-on-surface-variant mt-2">
            Fleet-wide biometric confidence
          </p>
        </div>
      </div>
    </div>
  );
}
