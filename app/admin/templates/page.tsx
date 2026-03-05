"use client";

import { useEffect, useState } from "react";
import TemplateEditor from "@/components/TemplateEditor";
import type { TemplateRow } from "@/types/db";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
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

  async function createTemplate(payload: {
    name: string;
    department: string;
    tenure: string;
    template_content: string;
  }) {
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      setError(body.error || "Failed to create template");
      return;
    }

    setSuccess("Template created successfully");
    await loadTemplates();
  }

  return (
    <div className="grid two">
      <TemplateEditor onSubmit={createTemplate} />

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
                <th>Tenure</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.name}</td>
                  <td>{template.department}</td>
                  <td>{template.tenure || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}