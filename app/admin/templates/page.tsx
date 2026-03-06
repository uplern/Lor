"use client";

import { useEffect, useState } from "react";
import TemplateEditor from "@/components/TemplateEditor";
import type { TemplateRow } from "@/types/db";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<TemplateRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadTemplates() {
    setError(null);
    const res = await fetch("/api/admin/templates", { cache: "no-store" });
    if (!res.ok) {
      setError("Failed to load templates");
      return;
    }
    const data = (await res.json()) as TemplateRow[];
    setTemplates(data);
  }

  useEffect(() => {
    void loadTemplates();
  }, []);

  async function handleFormSubmit(payload: {
    name: string;
    department: string;
    tenure: string;
    template_content: string;
  }) {
    setError(null);
    setSuccess(null);

    const url = editingTemplate ? `/api/admin/templates/${editingTemplate.id}` : "/api/admin/templates";
    const method = editingTemplate ? "PATCH" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      setError(body.error || `Failed to ${editingTemplate ? "update" : "create"} template`);
      return;
    }

    setSuccess(`Template ${editingTemplate ? "updated" : "created"} successfully`);
    setEditingTemplate(null);
    await loadTemplates();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) return;

    setError(null);
    setSuccess(null);

    const res = await fetch(`/api/admin/templates/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      setError("Failed to delete template");
      return;
    }

    setSuccess("Template deleted successfully");
    await loadTemplates();
  }

  return (
    <div className="grid two">
      <TemplateEditor
        onSubmit={handleFormSubmit}
        initialData={editingTemplate}
        onCancel={() => setEditingTemplate(null)}
      />

      <section className="card">
        <h3 className="panel-title">Templates</h3>
        {error ? <p className="error">{error}</p> : null}
        {success ? <p className="success">{success}</p> : null}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.name}</td>
                  <td>{template.department}</td>
                  <td>
                    <div className="admin-links">
                      <button className="btn secondary small" onClick={() => setEditingTemplate(template)}>
                        Edit
                      </button>
                      <button className="btn secondary small" onClick={() => handleDelete(template.id)}>
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