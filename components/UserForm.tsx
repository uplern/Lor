"use client";

import { FormEvent, useEffect, useState } from "react";

type TemplateOption = { id: string; name: string };

type Props = {
  templates: TemplateOption[];
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenure: string;
    template_id: string;
    gender?: string | null;
  } | null;
  onSubmit: (payload: {
    name: string;
    email: string;
    role: string;
    tenure: string;
    template_id: string;
    gender: string;
  }) => Promise<void>;
  onCancel?: () => void;
};

const DEFAULT_ROLE = "Recruitment Specialist and Business Partnership Executive";

const ROLE_OPTIONS = [
  "Recruitment Specialist and Business Partnership Executive",
  "Talent Acquisition",
  "Talent Acquisition & Marketing"
];

const ROLE_TENURE_MAP: Record<string, string[]> = {
  "Recruitment Specialist and Business Partnership Executive": ["65 Days"],
  "Talent Acquisition": ["1 Month", "2 Months"],
  "Talent Acquisition & Marketing": ["1 Month", "2 Months"]
};

function getTenureOptionsForRole(selectedRole: string): string[] {
  return ROLE_TENURE_MAP[selectedRole] || ["1 Month", "2 Months"];
}

export default function UserForm({ templates, onSubmit, initialData, onCancel }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [tenure, setTenure] = useState("65 Days");
  const [gender, setGender] = useState("male");
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const initRole = initialData.role || DEFAULT_ROLE;
      const validTenures = getTenureOptionsForRole(initRole);
      const initTenure = initialData.tenure && validTenures.includes(initialData.tenure) ? initialData.tenure : validTenures[0];

      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initRole);
      setTenure(initTenure);
      setGender(initialData.gender || "male");
      setTemplateId(initialData.template_id);
    } else {
      setName("");
      setEmail("");
      setRole(DEFAULT_ROLE);
      setTenure("65 Days");
      setGender("male");
      if (templates.length > 0) {
        setTemplateId(templates[0].id);
      }
    }
  }, [initialData, templates]);

  function handleRoleChange(newRole: string) {
    setRole(newRole);
    const validTenures = getTenureOptionsForRole(newRole);
    if (!validTenures.includes(tenure)) {
      setTenure(validTenures[0]);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ name, email, role, tenure, template_id: templateId, gender });
    setLoading(false);
    if (!initialData) {
      setName("");
      setEmail("");
      setRole(DEFAULT_ROLE);
      setTenure("65 Days");
      setGender("male");
    }
  }

  const availableTenureOptions = getTenureOptionsForRole(role);

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h3 className="panel-title">{initialData ? "Edit User Record" : "Add User Record"}</h3>

      <div>
        <label htmlFor="user-name">Candidate Name</label>
        <input id="user-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Adarsh Singh" required />
      </div>

      <div>
        <label htmlFor="user-email">Email</label>
        <input
          id="user-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="candidate@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="user-gender">Gender</label>
        <select id="user-gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="male">Male (he/him/his)</option>
          <option value="female">Female (she/her/her)</option>
        </select>
      </div>

      <div>
        <label htmlFor="user-role">Role / Position</label>
        <select id="user-role" value={role} onChange={(e) => handleRoleChange(e.target.value)} required>
          {ROLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="user-tenure">Tenure / Duration</label>
        <select id="user-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} required>
          {availableTenureOptions.map((option) => (
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

      <div className="admin-links" style={{ marginTop: "1rem" }}>
        <button className="btn" type="submit" disabled={loading || templates.length === 0 || !templateId}>
          {loading ? "Saving..." : initialData ? "Update User" : "Save User"}
        </button>
        {initialData && onCancel && (
          <button className="btn secondary" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}