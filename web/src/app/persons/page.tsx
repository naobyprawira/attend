"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { deletePerson, fetchPersons, personPhotoUrl, registerPerson } from "@/lib/api";
import type { Person } from "@/lib/types";

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setPersons(await fetchPersons());
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  const handleRegister = async () => {
    const file = fileRef.current?.files?.[0];
    if (!name.trim() || !file) return;
    setUploading(true);
    try {
      await registerPerson(name.trim(), file);
      setName("");
      setShowDialog(false);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch {}
    setUploading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this person?")) return;
    try {
      await deletePerson(id);
      await load();
    } catch {}
  };

  const filtered = persons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader title="Persons" breadcrumb="Manage / Persons">
        <button
          onClick={() => setShowDialog(true)}
          className="text-white text-sm px-5 py-2 rounded-lg cursor-pointer font-semibold"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + Add Person
        </button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border rounded-md text-sm px-3 py-2 w-64 focus:outline-none focus:border-[var(--color-primary)]"
          style={{ borderColor: "var(--color-border)", color: "var(--color-body)" }}
        />

        {/* Person grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12" style={{ color: "var(--color-muted)" }}>
            {persons.length === 0
              ? "No persons registered. Click '+ Add Person' to start."
              : "No results."}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-[5px] overflow-hidden"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div
                  className="aspect-square flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-bg)" }}
                >
                  <img
                    src={personPhotoUrl(person.id)}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-bold truncate" style={{ color: "var(--color-heading)" }}>
                    {person.name}
                  </div>
                  <div className="text-xs font-mono mt-1" style={{ color: "var(--color-primary)" }}>
                    {person.recognition_count} recognitions
                  </div>
                  <div className="text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                    Added {new Date(person.created_at).toLocaleDateString("en-GB")}
                  </div>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="mt-3 text-[11px] font-semibold tracking-wider cursor-pointer"
                    style={{ color: "var(--color-danger)" }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Person Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg w-96 p-6 space-y-4"
            style={{ boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}
          >
            <h3 className="text-lg font-bold" style={{ color: "var(--color-heading)" }}>
              Register New Person
            </h3>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--color-secondary)" }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full border text-sm px-3 py-2 rounded-md focus:outline-none focus:border-[var(--color-primary)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-body)" }}
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--color-secondary)" }}>
                Photo
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="text-sm"
                style={{ color: "var(--color-secondary)" }}
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm border rounded-md cursor-pointer"
                style={{ borderColor: "var(--color-border)", color: "var(--color-secondary)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={uploading || !name.trim()}
                className="px-4 py-2 text-sm text-white rounded-md disabled:opacity-50 cursor-pointer font-semibold"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {uploading ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
