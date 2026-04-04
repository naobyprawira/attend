"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/context";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/lib/queries";
import { Select } from "@/components/Select";
import type { User } from "@/lib/types";
import { normalizeEmail, validateEmail, validatePassword } from "@/lib/validation";

// ── Helpers ──────────────────────────────────────────────────

const ASSIGNABLE_ROLES = ["admin", "operator", "viewer"] as const;
type Role = (typeof ASSIGNABLE_ROLES)[number];
const ADMIN_ROLES = new Set(["super_admin", "admin"]);

const TABS = ["All", "Active", "Pending", "Inactive"] as const;
type Tab = (typeof TABS)[number];

const PER_PAGE = 8;

const ROLE_STYLE: Record<string, string> = {
  super_admin: "bg-rose-500/10 text-rose-500",
  admin: "bg-primary/10 text-primary",
  operator: "bg-secondary/10 text-secondary",
};
const roleStyle = (role: string) => ROLE_STYLE[role] ?? "bg-on-surface-variant/10 text-on-surface-variant";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  operator: "Operator",
  viewer: "Viewer",
};
const roleLabel = (role: string) => ROLE_LABEL[role] ?? role;

const STATUS_TEXT: Record<string, string> = {
  active: "text-green-500",
  pending: "text-amber-500",
};
const statusStyle = (s: string) => STATUS_TEXT[s] ?? "text-on-surface-variant/60";

const STATUS_DOT: Record<string, string> = {
  active: "bg-green-500",
  pending: "bg-amber-500",
};
const statusDot = (s: string) => STATUS_DOT[s] ?? "bg-on-surface-variant/40";

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function fmtLastSeen(iso: string | null) {
  if (!iso) return "Never";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Add User Dialog ──────────────────────────────────────────

function AddUserDialog({ onClose, currentUserRole }: { onClose: () => void; currentUserRole: string }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<Role>("operator");
  const createUser = useCreateUser();
  const availableRoles = currentUserRole === "super_admin"
    ? ASSIGNABLE_ROLES
    : ASSIGNABLE_ROLES.filter((r) => r !== "admin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) return;

    const normalizedEmail = normalizeEmail(email);
    const emailError = validateEmail(normalizedEmail);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    const passwordError = validatePassword(password, {
      username,
      email: normalizedEmail,
    });
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      await createUser.mutateAsync({ username: username.trim(), email: normalizedEmail, password, role });
      toast.success(`User "${username}" created`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user");
    }
  }

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-[26rem] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
          <h3 className="font-bold text-on-surface">Add User</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Username</label>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              className="w-full bg-surface-container-highest border-none rounded-lg py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-surface-container-highest border-none rounded-lg py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
              maxLength={254}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-highest border-none rounded-lg py-2.5 px-3.5 pr-10 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                minLength={12}
                maxLength={128}
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-3 text-on-surface-variant/60 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">{showPw ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Use 12+ characters with uppercase, lowercase, number, and symbol.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Role</label>
            <Select
              value={role}
              onChange={(v) => setRole(v as Role)}
              options={availableRoles.map((r) => ({ value: r, label: roleLabel(r) }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUser.isPending}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold primary-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {createUser.isPending ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit User Dialog ─────────────────────────────────────────

function EditUserDialog({ user, onClose, currentUserRole }: { user: User; onClose: () => void; currentUserRole: string }) {
  const [role, setRole] = useState<Role>(user.role as Role);
  const [status, setStatus] = useState(user.status);
  const updateUser = useUpdateUser();
  const availableRoles = currentUserRole === "super_admin"
    ? ASSIGNABLE_ROLES
    : ASSIGNABLE_ROLES.filter((r) => r !== "admin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateUser.mutateAsync({ id: user.id, role, status });
      toast.success(`Updated "${user.username}"`);
      onClose();
    } catch {
      toast.error("Failed to update user");
    }
  }

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-[24rem] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
          <div>
            <h3 className="font-bold text-on-surface">Edit User</h3>
            <p className="text-xs text-on-surface-variant">{user.username}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Role</label>
            <Select
              value={role}
              onChange={(v) => setRole(v as Role)}
              options={availableRoles.map((r) => ({ value: r, label: roleLabel(r) }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</label>
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateUser.isPending}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold primary-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {updateUser.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Button ─────────────────────────────────────

function DeleteButton({ userId, onDeleted }: { userId: number; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deleteUser = useDeleteUser();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), 3000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      deleteUser.mutate(userId, {
        onSuccess: () => { toast.success("User deleted"); onDeleted(); },
        onError: () => toast.error("Failed to delete user"),
      });
      setConfirming(false);
    }
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <button
      onClick={handleClick}
      disabled={deleteUser.isPending}
      title={confirming ? "Click again to confirm" : "Delete user"}
      className={`p-1.5 rounded-lg transition-all text-sm ${
        confirming
          ? "bg-error/10 text-error"
          : "hover:bg-surface-container text-on-surface-variant"
      }`}
    >
      <span className="material-symbols-outlined text-lg">
        {confirming ? "warning" : "delete"}
      </span>
    </button>
  );
}

// ── Skeleton Row ─────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-outline-variant/5">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-surface-container rounded animate-pulse" style={{ width: i === 0 ? "80%" : "60%" }} />
        </td>
      ))}
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function UsersPage() {
  const { user: me, isLoading: authLoading } = useAuth();
  const { data: users, isLoading, isError, refetch } = useUsers({ enabled: !authLoading });
  const updateUser = useUpdateUser();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // All hooks must run unconditionally before any early return
  const allUsers = useMemo(
    () => (Array.isArray(users) ? users : []),
    [users],
  );

  const { totalActive, totalPending, totalAdmins } = useMemo(() => {
    let active = 0, pending = 0, admins = 0;
    for (const u of allUsers) {
      if (u.status === "active") active++;
      if (u.status === "pending") pending++;
      if (u.role === "admin") admins++;
    }
    return { totalActive: active, totalPending: pending, totalAdmins: admins };
  }, [allUsers]);

  const filtered = useMemo(
    () => allUsers.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === "All" ||
        (activeTab === "Active" && u.status === "active") ||
        (activeTab === "Pending" && u.status === "pending") ||
        (activeTab === "Inactive" && u.status === "inactive");
      return matchSearch && matchTab;
    }),
    [allUsers, search, activeTab],
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    [filtered, currentPage],
  );

  const handleApprove = useCallback(async (user: User) => {
    try {
      await updateUser.mutateAsync({ id: user.id, status: "active" });
      toast.success(`"${user.username}" approved`);
    } catch {
      toast.error("Failed to approve user");
    }
  }, [updateUser]);

  // Admin gate — after all hooks
  if (me && !ADMIN_ROLES.has(me.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className="p-5 rounded-full bg-error/10">
          <span className="material-symbols-outlined text-error text-4xl">lock</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">Access Denied</h2>
        <p className="text-sm text-on-surface-variant text-center max-w-sm">
          User management is restricted to administrators. Contact your admin to request access.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-surface min-h-full">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-secondary-fixed tracking-tight">
            User Management
          </h2>
          <p className="text-on-surface-variant mt-2 font-medium text-sm">
            Manage accounts, roles, and access requests.
          </p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="primary-gradient text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: allUsers.length, icon: "group", color: "text-primary" },
          { label: "Active", value: totalActive, icon: "check_circle", color: "text-green-500" },
          { label: "Pending", value: totalPending, icon: "pending", color: "text-amber-500" },
          { label: "Admins", value: totalAdmins, icon: "admin_panel_settings", color: "text-primary" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined text-lg ${color}`}>{icon}</span>
            </div>
            <p className="text-2xl font-extrabold text-on-surface">{isLoading ? "—" : value}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by username or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
          />
        </div>
        <div className="flex gap-1 bg-surface-container rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab}
              {tab === "Pending" && totalPending > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalPending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        {isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-error">error</span>
            <p className="text-sm">Failed to load users.</p>
            <button onClick={() => refetch()} className="text-xs font-bold text-primary hover:underline">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                  <th className="px-6 py-4">User</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4 hidden sm:table-cell">Email</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Last Seen</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-on-surface-variant text-sm">
                        No users found.
                      </td>
                    </tr>
                  )
                  : paginated.map((user) => (
                    <tr key={user.id} className="border-b border-outline-variant/5 hover:bg-surface-container transition-colors">
                      {/* Avatar + username */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials(user.username)}
                          </div>
                          <span className="font-semibold text-on-surface whitespace-nowrap">
                            {user.username}
                            {user.id === me?.id && (
                              <span className="ml-1.5 text-[9px] font-bold text-primary bg-primary/10 rounded-full px-1.5 py-0.5 uppercase">you</span>
                            )}
                          </span>
                        </div>
                      </td>
                      {/* Role badge */}
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${roleStyle(user.role)}`}>
                          {roleLabel(user.role)}
                        </span>
                      </td>
                      {/* Email */}
                      <td className="px-4 py-4 hidden sm:table-cell text-on-surface-variant text-xs">{user.email}</td>
                      {/* Joined */}
                      <td className="px-4 py-4 hidden lg:table-cell text-on-surface-variant text-xs whitespace-nowrap">{fmtDate(user.created_at)}</td>
                      {/* Last seen */}
                      <td className="px-4 py-4 hidden lg:table-cell text-on-surface-variant text-xs whitespace-nowrap">{fmtLastSeen(user.last_login)}</td>
                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle(user.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot(user.status)}`} />
                          {user.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {user.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleApprove(user)}
                                title="Approve"
                                className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-500 transition-all"
                              >
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                              </button>
                              <DeleteButton userId={user.id} onDeleted={() => {}} />
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingUser(user)}
                                disabled={user.id === me?.id || user.role === "super_admin" || (user.role === "admin" && me?.role !== "super_admin")}
                                title={user.role === "super_admin" ? "Super admin cannot be edited" : user.role === "admin" && me?.role !== "super_admin" ? "Only super admin can edit admin accounts" : "Edit"}
                                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-30 transition-all"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <DeleteButton userId={user.id} onDeleted={() => {}} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant">
              Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-surface-container disabled:opacity-30 transition-all text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container"}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-surface-container disabled:opacity-30 transition-all text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {showAddDialog && <AddUserDialog onClose={() => setShowAddDialog(false)} currentUserRole={me?.role ?? ""} />}
      {editingUser && <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} currentUserRole={me?.role ?? ""} />}
    </div>
  );
}
