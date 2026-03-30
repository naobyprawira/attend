"use client";

import { useState } from "react";

/* ── Types ── */
interface PermissionRow {
  key: string;
  label: string;
  category: string;
}

type RoleName = "Super Admin" | "Security Lead" | "HR Manager" | "Workspace";

/* ── Permission definitions ── */
const CATEGORIES: { name: string; permissions: PermissionRow[] }[] = [
  {
    name: "Surveillance & Monitoring",
    permissions: [
      { key: "camera_view_feed", label: "camera_view_feed", category: "Surveillance & Monitoring" },
      { key: "camera_pan_tilt", label: "camera_pan_tilt", category: "Surveillance & Monitoring" },
      { key: "camera_playback", label: "camera_playback", category: "Surveillance & Monitoring" },
    ],
  },
  {
    name: "Intelligence & Identification",
    permissions: [
      { key: "person_register", label: "person_register", category: "Intelligence & Identification" },
      { key: "person_manage_card", label: "person_manage_card", category: "Intelligence & Identification" },
      { key: "biometric_match_verify", label: "biometric_match_verify", category: "Intelligence & Identification" },
    ],
  },
  {
    name: "Security Protocols",
    permissions: [
      { key: "door_remote_unlock", label: "door_remote_unlock", category: "Security Protocols" },
      { key: "global_alert_silence", label: "global_alert_silence", category: "Security Protocols" },
    ],
  },
];

const ROLES: RoleName[] = ["Super Admin", "Security Lead", "HR Manager", "Workspace"];

/* ── Default permission matrix ── */
const DEFAULT_MATRIX: Record<string, Record<RoleName, boolean>> = {
  camera_view_feed:       { "Super Admin": true,  "Security Lead": true,  "HR Manager": true,  Workspace: false },
  camera_pan_tilt:        { "Super Admin": true,  "Security Lead": true,  "HR Manager": false, Workspace: false },
  camera_playback:        { "Super Admin": true,  "Security Lead": true,  "HR Manager": false, Workspace: false },
  person_register:        { "Super Admin": true,  "Security Lead": false, "HR Manager": true,  Workspace: false },
  person_manage_card:     { "Super Admin": true,  "Security Lead": false, "HR Manager": true,  Workspace: false },
  biometric_match_verify: { "Super Admin": true,  "Security Lead": true,  "HR Manager": false, Workspace: false },
  door_remote_unlock:     { "Super Admin": true,  "Security Lead": true,  "HR Manager": false, Workspace: false },
  global_alert_silence:   { "Super Admin": true,  "Security Lead": false, "HR Manager": false, Workspace: false },
};

const TABS = ["All Modules", "Discovery", "Explicit", "Reset Matrix"] as const;

/* ── Active role assignments ── */
const ASSIGNMENTS = [
  { role: "Super Admin", count: 2 },
  { role: "Security Lead", count: 4 },
  { role: "HR Manager", count: 3 },
  { role: "Workspace", count: 18 },
];

export default function PermissionsPage() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All Modules");
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (permKey: string, role: RoleName) => {
    setMatrix((prev) => ({
      ...prev,
      [permKey]: {
        ...prev[permKey],
        [role]: !prev[permKey][role],
      },
    }));
    setHasChanges(true);
  };

  const handleResetMatrix = () => {
    setMatrix(DEFAULT_MATRIX);
    setHasChanges(false);
  };

  const handleSave = () => {
    setHasChanges(false);
  };

  const totalPermissions = Object.keys(matrix).length;
  const grantedCount = Object.values(matrix).reduce(
    (sum, roles) =>
      sum + Object.values(roles).filter(Boolean).length,
    0
  );
  const compliancePercent = Math.round(
    (grantedCount / (totalPermissions * ROLES.length)) * 100
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-surface dark:bg-dark-surface min-h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
            Role Management
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-secondary-fixed dark:text-dark-on-surface tracking-tight">
            Permission Matrix
          </h2>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-2 font-medium text-sm">
            Define granular access control across role hierarchies and system nodes.
          </p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-highest dark:bg-dark-surface-container-highest text-on-surface dark:text-dark-on-surface rounded-xl text-sm font-bold hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all">
            <span className="material-symbols-outlined text-sm">
              history
            </span>
            Audit Log
          </button>
          <button className="primary-gradient text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            Create Role
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-lg p-1 w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (tab === "Reset Matrix") {
                handleResetMatrix();
              } else {
                setActiveTab(tab);
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab && tab !== "Reset Matrix"
                ? "bg-surface-container-lowest dark:bg-dark-surface-container-lowest text-on-surface dark:text-dark-on-surface shadow-sm"
                : "text-on-surface-variant dark:text-dark-on-surface-variant hover:text-on-surface dark:hover:text-dark-on-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant min-w-[220px]">
                  Permission
                </th>
                {ROLES.map((role) => (
                  <th
                    key={role}
                    className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant text-center min-w-[120px]"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => (
                <>
                  {/* Category header row */}
                  <tr key={`cat-${cat.name}`}>
                    <td
                      colSpan={ROLES.length + 1}
                      className="px-6 pt-5 pb-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* Permission rows */}
                  {cat.permissions.map((perm) => (
                    <tr
                      key={perm.key}
                      className="border-b border-outline-variant/5 hover:bg-surface-container/50 dark:hover:bg-dark-surface-container/50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <code className="text-xs font-mono text-on-surface dark:text-dark-on-surface">
                          {perm.label}
                        </code>
                      </td>
                      {ROLES.map((role) => {
                        const granted = matrix[perm.key]?.[role] ?? false;
                        return (
                          <td key={role} className="px-4 py-3.5 text-center">
                            <button
                              onClick={() =>
                                togglePermission(perm.key, role)
                              }
                              className={`w-9 h-5 rounded-full relative transition-all ${
                                granted
                                  ? "bg-primary"
                                  : "bg-surface-container-highest dark:bg-dark-surface-container-highest"
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                                  granted ? "left-[18px]" : "left-0.5"
                                }`}
                              />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10 bg-surface-container/30 dark:bg-dark-surface-container/30">
          <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest font-bold">
            {totalPermissions} permissions &times; {ROLES.length} roles
          </p>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="primary-gradient text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-xs disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            Save Changes
          </button>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Policy Compliance */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
            Policy Compliance
          </h4>
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed mb-3">
            Current matrix configuration meets {compliancePercent}% of the
            organization&apos;s least-privilege security policy requirements.
          </p>
          <div className="h-2 bg-surface-container dark:bg-dark-surface-container rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${compliancePercent}%` }}
            />
          </div>
          <p className="text-xs text-primary font-bold mt-2">
            {compliancePercent}% Passed
          </p>
        </div>

        {/* Active Assignments */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
            Active Assignments
          </h4>
          <div className="space-y-3">
            {ASSIGNMENTS.map((a) => (
              <div key={a.role} className="flex items-center justify-between">
                <span className="text-sm text-on-surface dark:text-dark-on-surface font-medium">
                  {a.role}
                </span>
                <div className="flex items-center gap-2">
                  {/* Stacked avatars */}
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(a.count, 3) }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-2 border-surface-container-lowest dark:border-dark-surface-container-lowest flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[10px] text-on-surface-variant">
                            person
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant font-mono">
                    {a.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Access - dark card */}
        <div className="bg-dark-surface-container dark:bg-dark-surface-container rounded-2xl p-6 border border-outline-variant/5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-dark-on-surface-variant mb-3">
            Developer Access
          </h4>
          <p className="text-sm text-dark-on-surface-variant leading-relaxed mb-4">
            API token scoping and service account permissions are managed
            separately via the developer console.
          </p>
          <button className="w-full bg-primary text-white px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}
