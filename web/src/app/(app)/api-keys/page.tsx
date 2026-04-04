"use client";

import { useState } from "react";

const KEYS = [
  { name: "Production API", key: "ak_prod_****...x8f2", permissions: "Full Access", rateLimit: "10,000/hr", status: "Active", created: "2025-11-14" },
  { name: "Analytics Service", key: "ak_anlyt_****...m3k1", permissions: "Read Only", rateLimit: "5,000/hr", status: "Active", created: "2025-12-02" },
  { name: "Mobile SDK", key: "ak_mobi_****...p9z4", permissions: "Limited", rateLimit: "2,500/hr", status: "Active", created: "2026-01-18" },
  { name: "Staging Environment", key: "ak_stag_****...b2w7", permissions: "Full Access", rateLimit: "1,000/hr", status: "Active", created: "2026-02-05" },
  { name: "Third-Party Integration", key: "ak_3pty_****...q5n8", permissions: "Write Only", rateLimit: "3,000/hr", status: "Active", created: "2026-03-10" },
];

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState<"active" | "revoked">("active");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">
            API Key Management
          </h2>
          <p className="text-on-surface-variant mt-2 font-medium">
            Create, manage, and monitor API access credentials.
          </p>
        </div>
        {/* Tabs */}
        <div className="flex bg-surface-container-highest rounded-lg p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === "active"
                ? "bg-gradient-to-br from-primary to-primary-container text-white shadow"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Active Keys
          </button>
          <button
            onClick={() => setActiveTab("revoked")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === "revoked"
                ? "bg-gradient-to-br from-primary to-primary-container text-white shadow"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Revoked
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
            Total Requests
          </p>
          <h3 className="text-3xl font-black text-on-surface">1.2M</h3>
          <p className="text-xs mt-2 flex items-center gap-1 text-green-500">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +18% this month
          </p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">api</span>
          </div>
        </div>

        <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
            Active Keys
          </p>
          <h3 className="text-3xl font-black text-on-surface">42</h3>
          <p className="text-xs mt-2 flex items-center gap-1 text-primary-fixed-dim">
            <span className="material-symbols-outlined text-sm">vpn_key</span>
            5 created this week
          </p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">key</span>
          </div>
        </div>

        <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
            Avg Latency
          </p>
          <h3 className="text-3xl font-black text-on-surface">84ms</h3>
          <div className="w-full h-1 bg-surface-container-high rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: "16%" }} />
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">speed</span>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl relative overflow-hidden text-white">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 text-white/70">Upgrade</p>
          <h3 className="text-lg font-black">Upgrade to Enterprise</h3>
          <p className="text-xs mt-2 text-white/70 leading-relaxed">Unlimited API keys and higher rate limits.</p>
          <button className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-widest transition-all">
            Learn More
          </button>
        </div>
      </div>

      {/* Infrastructure Keys Table */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden">
        <div className="p-5 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-4">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
            Infrastructure Keys
          </h4>
          <button className="primary-gradient text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">add</span>
            Generate Key
          </button>
        </div>
        {activeTab === "active" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                  <th className="text-left px-5 py-4 font-bold">Name</th>
                  <th className="text-left px-5 py-4 font-bold">Key</th>
                  <th className="text-left px-5 py-4 font-bold">Permissions</th>
                  <th className="text-left px-5 py-4 font-bold">Rate Limit</th>
                  <th className="text-left px-5 py-4 font-bold">Status</th>
                  <th className="text-left px-5 py-4 font-bold">Created</th>
                  <th className="text-left px-5 py-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {KEYS.map((k) => (
                  <tr key={k.name} className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                    <td className="px-5 py-4 font-bold text-on-surface">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">vpn_key</span>
                        {k.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        {k.key}
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        k.permissions === "Full Access"
                          ? "bg-primary/10 text-primary-fixed-dim"
                          : k.permissions === "Read Only"
                          ? "bg-green-500/10 text-green-500"
                          : k.permissions === "Write Only"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}>
                        {k.permissions}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-on-surface-variant">{k.rateLimit}</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest bg-green-500/10 text-green-500">
                        {k.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-on-surface-variant">{k.created}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-error/10 transition-colors text-on-surface-variant hover:text-error">
                          <span className="material-symbols-outlined text-sm">block</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl mb-2 block opacity-30">key_off</span>
            <p className="text-sm">No revoked keys</p>
          </div>
        )}
      </div>

      {/* Bottom Row: Security + API Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Best Practices */}
        <div className="bg-surface-variant rounded-xl border border-outline-variant/5 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">shield</span>
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface">
              Security Best Practices
            </h4>
          </div>
          <ul className="space-y-3">
            {[
              "Never commit API keys to source code repositories like GitHub.",
              "Rotate keys regularly - we recommend every 90 days.",
              "Apply the Principle of Least Privilege by assigning only the necessary permissions.",
              "Monitor API key usage for anomalies and unauthorized access patterns.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                <span className="text-xs text-on-surface-variant leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* API Documentation */}
        <div className="bg-gradient-to-br from-primary/5 to-primary-container/5 rounded-xl border border-primary/10 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">menu_book</span>
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface">
                API Documentation
              </h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Explore the full Attend.AI API reference, including authentication, endpoints, rate limits, and webhook configuration.
            </p>
          </div>
          <button className="mt-6 primary-gradient text-white text-xs font-bold px-5 py-3 rounded-xl uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 self-start">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
