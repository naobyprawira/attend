"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { personPhotoUrl } from "@/lib/api";
import { usePersons, useRegisterPerson, useDeletePerson } from "@/lib/queries";
import type { Person } from "@/lib/types";

/* ── Extended person type for dummy data with extra fields ── */
interface PersonExt extends Person {
  email?: string;
  department?: string;
  role?: string;
  phone?: string;
  status?: "Active" | "Inactive";
}

/* ── Dummy data fallback ── */
const DUMMY_PERSONS: PersonExt[] = [
  { id: 1, name: "Elena Rodriguez", photo_path: "", photo_url: "", created_at: "2026-03-15T09:12:00Z", recognition_count: 142, email: "e.rodriguez@attend.ai", department: "Engineering", role: "Lead Designer", phone: "+1 (555) 902-1234", status: "Active" },
  { id: 2, name: "Marcus Chen", photo_path: "", photo_url: "", created_at: "2026-03-10T09:00:00Z", recognition_count: 98, email: "m.chen@attend.ai", department: "Engineering", role: "Staff AI Eng", phone: "+1 (555) 902-1235", status: "Active" },
  { id: 3, name: "Sarah Jenkins", photo_path: "", photo_url: "", created_at: "2026-03-20T09:00:00Z", recognition_count: 67, email: "s.jenkins@attend.ai", department: "Human Resources", role: "HR Specialist", phone: "+1 (555) 902-1236", status: "Inactive" },
  { id: 4, name: "Amara Okafor", photo_path: "", photo_url: "", created_at: "2026-03-18T09:00:00Z", recognition_count: 85, email: "a.okafor@attend.ai", department: "Engineering", role: "Backend Engineer", phone: "+1 (555) 902-1237", status: "Active" },
  { id: 5, name: "Lisa Wong", photo_path: "", photo_url: "", created_at: "2026-03-25T09:00:00Z", recognition_count: 34, email: "l.wong@attend.ai", department: "Operations", role: "Ops Manager", phone: "+1 (555) 902-1238", status: "Active" },
  { id: 6, name: "James Miller", photo_path: "", photo_url: "", created_at: "2026-03-28T09:00:00Z", recognition_count: 12, email: "j.miller@attend.ai", department: "Marketing", role: "Brand Lead", phone: "+1 (555) 902-1239", status: "Active" },
];

const DEPARTMENTS = [
  { name: "Engineering", children: ["Frontend Architecture", "Backend & AI", "Surveillance Ops"] },
  { name: "Human Resources", children: [] },
  { name: "Operations", children: [] },
  { name: "Marketing", children: [] },
];

const RECENT_EVENTS = [
  { id: 1, title: "Access Granted: Main Lobby", time: "Today, 09:12 AM", match: "98.4%" },
  { id: 2, title: "Access Granted: Lab 4", time: "Today, 10:45 AM", match: "99.1%" },
];

/* ── Calendar helper ── */
const ATTENDANCE_DAYS = [
  "green","green","red","green","amber","off","off",
  "green","green","green","green","green","off","off",
  "green","red","green","green","green","off","off",
  "green","green","green","green","green","off","off",
];

export default function PersonsPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expandedDept, setExpandedDept] = useState<string | null>("Engineering");
  const [activeDept, setActiveDept] = useState<string | null>("Engineering");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: rawPersons = [], isError } = usePersons();
  const registerMutation = useRegisterPerson();
  const deleteMutation = useDeletePerson();

  const backendOnline = !isError;

  const persons: PersonExt[] = backendOnline
    ? rawPersons.map((p: Person) => ({ ...p, department: "Engineering", role: "Member", status: "Active" as const }))
    : DUMMY_PERSONS;

  const handleRegister = async () => {
    const file = fileRef.current?.files?.[0];
    if (!name.trim() || !file) return;
    try {
      await registerMutation.mutateAsync({ name: name.trim(), photo: file });
      setName("");
      setShowDialog(false);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Failed to register person");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this person?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      toast.error("Failed to remove person");
    }
    if (selectedId === id) setSelectedId(null);
  };

  const filtered = persons.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !activeDept || (p.department ?? "Engineering") === activeDept;
    return matchesSearch && matchesDept;
  });

  const selected = persons.find((p) => p.id === selectedId) ?? null;

  const deptCounts = persons.reduce<Record<string, number>>((acc, p) => {
    const d = p.department ?? "Engineering";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full bg-surface dark:bg-dark-surface">
      {/* ── Left Panel: Department Tree ── */}
      <section className="hidden lg:block lg:w-[20%] lg:min-w-[200px] bg-surface-container-low dark:bg-dark-surface-container-low p-4 sm:p-6 overflow-y-auto border-r border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant">
            Departments
          </h3>
          <span className="material-symbols-outlined text-secondary text-lg cursor-pointer">account_tree</span>
        </div>

        <div className="space-y-2">
          {/* Root */}
          <div
            className="flex items-center gap-2 py-1.5 cursor-pointer"
            onClick={() => { setActiveDept(null); setExpandedDept(null); }}
          >
            <span className="material-symbols-outlined text-secondary text-sm">keyboard_arrow_down</span>
            <span className="material-symbols-outlined text-primary text-lg">corporate_fare</span>
            <span className="font-semibold text-sm text-on-surface dark:text-dark-on-surface">Attend Corp</span>
          </div>

          {/* Department nodes */}
          <div className="ml-6 space-y-1">
            {DEPARTMENTS.map((dept) => {
              const isExpanded = expandedDept === dept.name;
              const isActive = activeDept === dept.name;
              return (
                <div key={dept.name}>
                  <div
                    onClick={() => {
                      setExpandedDept(isExpanded ? null : dept.name);
                      setActiveDept(dept.name);
                    }}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-primary-container text-white shadow-md"
                        : "hover:bg-surface-container dark:hover:bg-dark-surface-container text-on-surface-variant dark:text-dark-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isExpanded ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                    </span>
                    <span className="text-sm font-medium flex-1">{dept.name}</span>
                    <span className="text-[10px] opacity-60">{deptCounts[dept.name] ?? 0}</span>
                  </div>
                  {isExpanded && dept.children.length > 0 && (
                    <div className="ml-6 space-y-1 border-l-2 border-outline-variant/30 pl-4 py-1">
                      {dept.children.map((child) => (
                        <div
                          key={child}
                          className="py-1 text-sm text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary cursor-pointer transition-colors"
                        >
                          {child}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Center Panel: Person Cards ── */}
      <section className="w-full lg:w-[40%] flex-1 lg:flex-none bg-surface dark:bg-dark-surface p-4 sm:p-6 overflow-y-auto border-r border-outline-variant/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-on-surface dark:text-dark-on-surface">Personnel</h2>
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
              {filtered.length} active members{activeDept ? ` in ${activeDept}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-surface-container-high dark:bg-dark-surface-container-high rounded-lg text-primary hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all">
              <span className="material-symbols-outlined">upload</span>
            </button>
            <button
              onClick={() => setShowDialog(true)}
              className="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-lg shadow-lg hover:shadow-primary/20 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Person
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
          <input
            type="text"
            placeholder="Search personnel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface dark:text-dark-on-surface"
          />
        </div>

        {/* Card Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant dark:text-dark-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 opacity-20 block">group</span>
            <p className="text-sm">
              {persons.length === 0
                ? "No persons registered yet."
                : "No results found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((person) => {
              const isSelected = person.id === selectedId;
              const isInactive = person.status === "Inactive";
              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedId(person.id)}
                  className={`bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? "border-outline-variant/20 ring-2 ring-primary-container/20 shadow-xl shadow-on-surface/5"
                      : "border-transparent hover:border-outline-variant/20 hover:shadow-xl hover:shadow-on-surface/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full bg-surface-container-high dark:bg-dark-surface-container-high flex items-center justify-center overflow-hidden relative ${isInactive ? "grayscale opacity-60" : ""}`}>
                      {backendOnline ? (
                        <img
                          src={personPhotoUrl(person.id)}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : null}
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant/30 absolute">person</span>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                      isInactive
                        ? "bg-surface-container-high text-on-surface-variant"
                        : "bg-on-tertiary-container/10 text-tertiary"
                    }`}>
                      {person.status ?? "Active"}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm ${isInactive ? "text-on-surface/60" : "text-on-surface dark:text-dark-on-surface"}`}>
                    {person.name}
                  </h4>
                  <p className={`text-[10px] mb-3 ${isInactive ? "text-on-surface-variant/60" : "text-on-surface-variant dark:text-dark-on-surface-variant"}`}>
                    ID: #AI-{String(90210 + person.id - 1).padStart(5, "0")}
                  </p>
                  <div className={`flex flex-wrap gap-1 ${isInactive ? "opacity-60" : ""}`}>
                    <span className="px-2 py-0.5 bg-surface-container-high dark:bg-dark-surface-container-high text-on-surface-variant dark:text-dark-on-surface-variant text-[10px] rounded">
                      {person.department ?? "Engineering"}
                    </span>
                    {person.role && (
                      <span className="px-2 py-0.5 bg-surface-container-high dark:bg-dark-surface-container-high text-on-surface-variant dark:text-dark-on-surface-variant text-[10px] rounded">
                        {person.role}
                      </span>
                    )}
                  </div>

                  {/* Delete on hover */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(person.id); }}
                    className="mt-3 opacity-0 group-hover:opacity-100 text-error text-[10px] font-bold uppercase tracking-wider hover:underline transition-all"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!backendOnline && (
          <p className="text-xs text-primary mt-4">Showing demo data &mdash; backend offline</p>
        )}
      </section>

      {/* ── Right Panel: Person Detail ── */}
      <section className="hidden lg:block lg:w-[40%] bg-surface-container-low dark:bg-dark-surface-container-low p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {selected ? (
          <>
            {/* Header with photo */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl bg-surface-container-high dark:bg-dark-surface-container-high flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/10 border-4 border-white dark:border-dark-surface-container">
                    {backendOnline ? (
                      <img
                        src={personPhotoUrl(selected.id)}
                        alt={selected.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : null}
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 absolute">person</span>
                  </div>
                  {selected.status !== "Inactive" && (
                    <div className="absolute -bottom-2 -right-2 bg-on-tertiary-container p-1 rounded-lg text-white shadow-lg">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-on-surface dark:text-dark-on-surface">
                    {selected.name}
                  </h2>
                  <p className="text-primary font-medium mb-4">{selected.role ?? "Member"}</p>
                  <div className="flex gap-4">
                    <button className="p-2 bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-lg text-secondary hover:text-primary transition-all shadow-sm">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button className="p-2 bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-lg text-secondary hover:text-primary transition-all shadow-sm">
                      <span className="material-symbols-outlined text-sm">mail</span>
                    </button>
                    <button className="p-2 bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-lg text-secondary hover:text-primary transition-all shadow-sm">
                      <span className="material-symbols-outlined text-sm">more_horiz</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={selected.status !== "Inactive"}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-[10px] font-bold uppercase text-on-surface-variant dark:text-dark-on-surface-variant tracking-tighter">
                  System Access
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-1">Employee ID</p>
                <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">AI-{String(90210 + selected.id - 1).padStart(5, "0")}</p>
              </div>
              <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-1">Department</p>
                <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{selected.department ?? "Engineering"}</p>
              </div>
              <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-1">Email</p>
                <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface truncate">{selected.email ?? "—"}</p>
              </div>
              <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-1">Phone</p>
                <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{selected.phone ?? "—"}</p>
              </div>
            </div>

            {/* Attendance Calendar */}
            <div className="mb-8 bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-on-surface dark:text-dark-on-surface">Attendance - March</h3>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-on-tertiary-container inline-block"></span> Present
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Absent
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} className="text-on-surface-variant font-bold">{d}</div>
                ))}
                {ATTENDANCE_DAYS.map((status, i) => (
                  <div key={i} className={`py-2 rounded-lg cursor-default relative text-on-surface dark:text-dark-on-surface ${status === "off" ? "opacity-30" : "hover:bg-surface-container"}`}>
                    {i + 1}
                    {status !== "off" && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                        status === "green" ? "bg-on-tertiary-container" : status === "red" ? "bg-error" : "bg-primary-fixed-dim"
                      }`}></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Events */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-on-surface dark:text-dark-on-surface">Recent Surveillance Events</h3>
              <div className="space-y-3">
                {RECENT_EVENTS.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between p-3 bg-surface-container-lowest/50 dark:bg-dark-surface-container-lowest/50 rounded-lg hover:bg-surface-container-lowest dark:hover:bg-dark-surface-container-lowest transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-dim dark:bg-dark-surface-container overflow-hidden relative flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant/30 text-lg">videocam</span>
                        <div className="absolute inset-0 border border-primary-container/40 rounded-lg"></div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface dark:text-dark-on-surface">{evt.title}</p>
                        <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant">
                          {evt.time} &bull; {evt.match} Match
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recognition stats */}
            <div className="mt-6 p-4 bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl">
              <p className="text-[10px] font-bold uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-1">Total Recognitions</p>
              <p className="text-2xl font-extrabold text-primary">{selected.recognition_count}</p>
              <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                Since {new Date(selected.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant dark:text-dark-on-surface-variant">
            <span className="material-symbols-outlined text-6xl opacity-20 mb-4">person_search</span>
            <p className="text-sm">Select a person to view details</p>
          </div>
        )}
      </section>

      {/* ── Add Person Dialog ── */}
      {showDialog && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in">
          <div className="bg-surface-container-lowest dark:bg-dark-surface-container rounded-xl w-[28rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(27,28,29,0.25)]">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-on-surface dark:text-dark-on-surface tracking-tight">
                    Register New Person
                  </h3>
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                    Add a new identity to the recognition database.
                  </p>
                </div>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-secondary hover:text-on-surface dark:hover:text-dark-on-surface p-1 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-[0.2em]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 text-on-surface dark:text-dark-on-surface"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-[0.2em]">
                    Reference Photo
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-3 px-4 text-sm text-on-surface-variant dark:text-dark-on-surface-variant file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary file:uppercase file:tracking-widest"
                  />
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button
                  onClick={() => setShowDialog(false)}
                  className="flex-1 py-3.5 bg-surface-container-high dark:bg-dark-surface-container-high text-on-surface-variant dark:text-dark-on-surface-variant font-bold rounded-xl hover:bg-surface-container-highest dark:hover:bg-dark-surface-container-highest transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending || !name.trim()}
                  className="flex-[2] py-3.5 primary-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                >
                  {registerMutation.isPending ? "Registering..." : "Register Person"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
