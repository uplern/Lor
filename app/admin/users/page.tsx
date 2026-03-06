"use client";

import { useEffect, useMemo, useState } from "react";
import UserForm from "@/components/UserForm";
import type { LORUserRow, TemplateRow } from "@/types/db";

export default function UsersPage() {
  const [users, setUsers] = useState<LORUserRow[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [editingUser, setEditingUser] = useState<LORUserRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadAll() {
    setError(null);

    const [userRes, templateRes] = await Promise.all([
      fetch("/api/admin/users", { cache: "no-store" }),
      fetch("/api/admin/templates", { cache: "no-store" })
    ]);

    if (!userRes.ok || !templateRes.ok) {
      setError("Failed to load admin data");
      return;
    }

    const [userData, templateData] = await Promise.all([userRes.json(), templateRes.json()]);
    setUsers(userData);
    setTemplates(templateData);
  }

  useEffect(() => {
    void loadAll();
  }, []);

  const templateMap = useMemo(() => {
    return new Map(templates.map((template) => [template.id, template.name]));
  }, [templates]);

  async function handleFormSubmit(payload: {
    name: string;
    email: string;
    role: string;
    tenure: string;
    template_id: string;
  }) {
    setError(null);
    setSuccess(null);

    const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
    const method = editingUser ? "PATCH" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      setError(body.error || `Failed to ${editingUser ? "update" : "create"} user`);
      return;
    }

    setSuccess(`User ${editingUser ? "updated" : "created"} successfully`);
    setEditingUser(null);
    await loadAll();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user record?")) return;

    setError(null);
    setSuccess(null);

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      setError("Failed to delete user record");
      return;
    }

    setSuccess("User record deleted successfully");
    await loadAll();
  }

  return (
    <div className="grid two">
      <UserForm
        templates={templates.map((template) => ({ id: template.id, name: template.name }))}
        initialData={editingUser}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingUser(null)}
      />

      <section className="card">
        <h3 className="panel-title">Users</h3>
        {error ? <p className="error">{error}</p> : null}
        {success ? <p className="success">{success}</p> : null}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Template</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{templateMap.get(user.template_id) || user.template_id}</td>
                  <td>
                    <div className="admin-links">
                      <button className="btn secondary small" onClick={() => setEditingUser(user)}>
                        Edit
                      </button>
                      <button className="btn secondary small" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}