"use client";

import { FormEvent, useEffect, useState } from "react";

type Props = {
  initialData?: {
    id: string;
    name: string;
    department: string;
    tenure: string | null;
    template_content: string;
  } | null;
  onSubmit: (payload: {
    name: string;
    department: string;
    tenure: string;
    template_content: string;
  }) => Promise<void>;
  onCancel?: () => void;
};

const DEFAULT_TEMPLATE = `It is a pleasure to write this letter of recommendation for {{Name}}. During the {{Tenure}} {{Role}} internship with us, we found them to be a diligent, responsible, and punctual individual who consistently completed all assigned tasks on time. Their dedication and willingness to learn were truly commendable.

We considered it a privilege to have them as part of our team, and they proved to be a valuable asset to our organization. Their conduct, professionalism, and work performance were excellent throughout the internship.

In summary, I would like to express my strong support for them as a sincere and hardworking individual. I wholeheartedly recommend {{Name}} for any future academic or professional opportunities.

Sincerely,
Atul Kumar
Founder Uplern.`;

const PLACEHOLDER_HINT = "Use placeholders: {{Name}}, {{Role}}, {{Tenure}}, {{Date}}.";

export default function TemplateEditor({ onSubmit, initialData, onCancel }: Props) {
  const [name, setName] = useState("Uplern Standard LOR");
  const [department, setDepartment] = useState("Human Resources");
  const [tenure, setTenure] = useState("1-2 Months");
  const [templateContent, setTemplateContent] = useState(DEFAULT_TEMPLATE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDepartment(initialData.department);
      setTenure(initialData.tenure || "");
      setTemplateContent(initialData.template_content);
    } else {
      setName("Uplern Standard LOR");
      setDepartment("Human Resources");
      setTenure("1-2 Months");
      setTemplateContent(DEFAULT_TEMPLATE);
    }
  }, [initialData]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      name,
      department,
      tenure,
      template_content: templateContent
    });
    setLoading(false);
  }

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h3 className="panel-title">{initialData ? "Edit Template" : "Create Template"}</h3>

      <div>
        <label htmlFor="template-name">Template Name</label>
        <input id="template-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="template-dept">Department</label>
        <input
          id="template-dept"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="template-tenure">Tenure Label</label>
        <input id="template-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} />
      </div>

      <div>
        <label htmlFor="template-content">Template Content</label>
        <textarea
          id="template-content"
          value={templateContent}
          onChange={(e) => setTemplateContent(e.target.value)}
          required
        />
        <p className="muted">{PLACEHOLDER_HINT}</p>
      </div>

      <div className="admin-links" style={{ marginTop: "1rem" }}>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Template" : "Save Template"}
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