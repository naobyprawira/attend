"use client";

import { useState } from "react";

/* ── Sidebar Nav ── */
const NAV_SECTIONS = [
  {
    label: "API Interactions",
    icon: "api",
    children: [],
  },
  {
    label: "Persons",
    icon: "group",
    children: ["List Persons", "Register New", "Update Attributes"],
  },
  {
    label: "Webhooks",
    icon: "webhook",
    children: [],
  },
  {
    label: "Events",
    icon: "notifications",
    children: [],
  },
];

/* ── Endpoint data ── */
interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  title: string;
  description: string;
  queryParams?: Param[];
  pathParams?: Param[];
  requestBody?: string;
  responseExample: string;
  statusCode: number;
}

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-green-500/10 text-green-600",
  POST: "bg-blue-500/10 text-blue-600",
  PUT: "bg-amber-500/10 text-amber-600",
  DELETE: "bg-red-500/10 text-red-600",
};

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/v1/persons",
    title: "List Registered Persons",
    description:
      "Retrieves a paginated list of all identities currently stored in the biometric registry. Supports filtering by confidence score and last seen timestamp.",
    queryParams: [
      { name: "limit", type: "integer", required: false, description: "Max results per page (default: 20)" },
      { name: "offset", type: "integer", required: false, description: "Pagination offset" },
      { name: "sort", type: "string", required: false, description: 'Sort field (e.g. "created_at", "name")' },
    ],
    statusCode: 200,
    responseExample: `{
  "status": "success",
  "data": [
    {
      "id": "prs_8xk2m",
      "name": "Elena Rodriguez",
      "confidence": 0.984,
      "created_at": "2026-03-15T09:12:00Z",
      "photo_url": "/faces/prs_8xk2m.jpg",
      "tags": ["engineering", "level-3"]
    }
  ],
  "meta": { "total": 142, "limit": 20, "offset": 0 }
}`,
  },
  {
    method: "POST",
    path: "/v1/persons/register",
    title: "Register New Identity",
    description:
      "Insert a new biometric profile into the recognition corpus. Requires a high-resolution base image and metadata payload.",
    statusCode: 201,
    requestBody: `{
  "name": "Marcus Chen",
  "department": "Engineering",
  "photo_base64": "<base64-encoded-image>",
  "tags": ["admin", "level-5"],
  "metadata": {
    "employee_id": "AI-90214",
    "clearance": "A"
  }
}`,
    responseExample: `{
  "status": "created",
  "data": {
    "id": "prs_9yz3n",
    "name": "Marcus Chen",
    "confidence": null,
    "created_at": "2026-03-30T14:22:00Z"
  }
}`,
  },
  {
    method: "PUT",
    path: "/v1/persons/:id",
    title: "Update Identity Attributes",
    description:
      "Modify non-biometric attributes of a registered person. This is an idempotent operation that supports updating existing data in the targeted fields.",
    pathParams: [
      { name: "id", type: "string", required: true, description: "Person identifier (e.g. prs_8xk2m)" },
    ],
    statusCode: 200,
    requestBody: `{
  "name": "Elena R.",
  "tags": ["engineering", "lead"],
  "metadata": { "clearance": "A" }
}`,
    responseExample: `{
  "status": "updated",
  "data": {
    "id": "prs_8xk2m",
    "name": "Elena R.",
    "updated_at": "2026-03-30T15:00:00Z"
  }
}`,
  },
];

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("Persons");
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(0);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full bg-surface">
      {/* ── Left Sidebar ── */}
      <aside className="hidden lg:block lg:w-60 xl:w-64 bg-surface-container-low border-r border-outline-variant/10 p-4 sm:p-6 overflow-y-auto shrink-0">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Core API
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">
              Online
            </span>
            <span className="text-[10px] text-on-surface-variant">
              Last updated 2 hours ago
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_SECTIONS.map((section) => {
            const isActive = activeSection === section.label;
            return (
              <div key={section.label}>
                <button
                  onClick={() => setActiveSection(section.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-container text-white shadow-md"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {section.icon}
                  </span>
                  {section.label}
                </button>
                {isActive && section.children.length > 0 && (
                  <div className="ml-9 mt-1 space-y-0.5 border-l-2 border-outline-variant/20 pl-3">
                    {section.children.map((child) => (
                      <p
                        key={child}
                        className="text-xs py-1.5 text-on-surface-variant hover:text-primary cursor-pointer transition-colors"
                      >
                        {child}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Convert export button */}
        <div className="mt-8">
          <button className="w-full primary-gradient text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">
              download
            </span>
            Export OpenAPI
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase lg:hidden">
              Online
            </span>
            <span className="text-[10px] text-on-surface-variant lg:hidden">
              Last updated 2 hours ago
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Persons Management
          </h2>
          <p className="text-on-surface-variant mt-3 font-medium text-sm max-w-2xl leading-relaxed">
            Interface with the core identity engine. This API allows for real-time person registration,
            biometric template management, and historical sighting retrieval. Powered by high-velocity neural processing.
          </p>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          {ENDPOINTS.map((ep, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden"
            >
              {/* Endpoint header */}
              <button
                onClick={() =>
                  setExpandedEndpoint(expandedEndpoint === idx ? null : idx)
                }
                className="w-full flex items-center gap-3 px-6 py-5 text-left hover:bg-surface-container/50 transition-colors"
              >
                <span
                  className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md shrink-0 ${
                    METHOD_STYLES[ep.method]
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-sm font-mono font-bold text-on-surface">
                  {ep.path}
                </code>
                <span className="material-symbols-outlined ml-auto text-on-surface-variant text-sm transition-transform duration-200"
                  style={{ transform: expandedEndpoint === idx ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  expand_more
                </span>
              </button>

              {/* Expanded content */}
              {expandedEndpoint === idx && (
                <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: description + params */}
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface mb-2">
                        {ep.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {ep.description}
                      </p>
                    </div>

                    {/* Query params */}
                    {ep.queryParams && ep.queryParams.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                          Query Parameters
                        </h4>
                        <div className="space-y-2">
                          {ep.queryParams.map((p) => (
                            <div
                              key={p.name}
                              className="flex items-start gap-3 text-sm"
                            >
                              <code className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded shrink-0">
                                {p.name}
                              </code>
                              <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded shrink-0">
                                {p.type}
                              </span>
                              <span className="text-xs text-on-surface-variant">
                                {p.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Path params */}
                    {ep.pathParams && ep.pathParams.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                          Path Parameters
                        </h4>
                        <div className="space-y-2">
                          {ep.pathParams.map((p) => (
                            <div
                              key={p.name}
                              className="flex items-start gap-3 text-sm"
                            >
                              <code className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded shrink-0">
                                {p.name}
                              </code>
                              <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded shrink-0">
                                {p.type}
                              </span>
                              {p.required && (
                                <span className="text-[10px] text-error font-bold">
                                  required
                                </span>
                              )}
                              <span className="text-xs text-on-surface-variant">
                                {p.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Important note for POST */}
                    {ep.method === "POST" && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                          info
                        </span>
                        <p className="text-xs text-primary font-medium leading-relaxed">
                          Image must be at least 320x320 for optimal biometric
                          extraction. Supported formats: JPEG / PNG (max 5MB for
                          embedded payload).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: code blocks */}
                  <div className="space-y-4">
                    {/* Request body */}
                    {ep.requestBody && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Request Body
                          </h4>
                          <button className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              content_copy
                            </span>
                            Copy
                          </button>
                        </div>
                        <div className="bg-surface-container-highest rounded-xl p-4 overflow-x-auto">
                          <pre className="text-xs font-mono text-on-surface-variant leading-relaxed whitespace-pre">
                            {ep.requestBody}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Response */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {ep.method === "GET"
                            ? `${ep.statusCode} Response`
                            : `${ep.statusCode} Implementation`}
                        </h4>
                        <button className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">
                            content_copy
                          </span>
                          Copy
                        </button>
                      </div>
                      <div className="bg-surface-container-highest rounded-xl p-4 overflow-x-auto">
                        <pre className="text-xs font-mono text-on-surface-variant leading-relaxed whitespace-pre">
                          {ep.responseExample}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-outline-variant/10 flex flex-wrap gap-6 text-[10px] text-on-surface-variant">
          <span className="hover:text-primary cursor-pointer transition-colors">Security Policy</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Service Status</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Developer Forum</span>
          <span className="ml-auto">&copy; 2026 Observational Monolith</span>
        </div>
      </main>
    </div>
  );
}
