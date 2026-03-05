"use client";

import { FormEvent, useEffect, useState } from "react";

type TemplateOption = { id: string; name: string };

type Props = {
  templates: TemplateOption[];
  onSubmit: (payload: {
    name: string;
    email: string;
    role: string;
    tenure: string;
    template_id: string;
  }) => Promise<void>;
};

const ROLE_OPTIONS = ["Talent Acquisition", "Talent Acquisition & Marketing"];
const TENURE_OPTIONS = ["1 Month", "2 Months"];

export default function UserForm({ templates, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Talent Acquisition");
  const [tenure, setTenure] = useState("2 Months");
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!templateId && templates.length > 0) {
      setTemplateId(templates[0].id);
    }
  }, [templateId, templates]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ name, email, role, tenure, template_id: templateId });
    setLoading(false);
    setName("");
    setEmail("");
    setRole("Talent Acquisition");
    setTenure("2 Months");
  }

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h3 className="panel-title">Add User Record</h3>

      <div>
        <label htmlFor="user-name">Name</label>
        <input id="user-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="user-email">Email</label>
        <input
          id="user-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
      </div>

      <div>
        <label htmlFor="user-role">Role</label>
        <select id="user-role" value={role} onChange={(e) => setRole(e.target.value)} required>
          {ROLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="user-tenure">Tenure</label>
        <select id="user-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} required>
          {TENURE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="user-template">Template</label>
        <select
          id="user-template"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          required
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn" type="submit" disabled={loading || templates.length === 0 || !templateId}>
        {loading ? "Saving..." : "Save User"}
      </button>
    </form>
  );
}