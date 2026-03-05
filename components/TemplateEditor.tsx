"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSubmit: (payload: {
    name: string;
    department: string;
    tenure: string;
    template_content: string;
  }) => Promise<void>;
};

const DEFAULT_TEMPLATE = `It is a pleasure to write this letter of recommendation for {{Name}}. During the {{Tenure}} {{Role}} internship with us, we found them to be a diligent, responsible, and punctual individual who consistently completed all assigned tasks on time. Their dedication and willingness to learn were truly commendable.

We considered it a privilege to have them as part of our team, and they proved to be a valuable asset to our organization. Their conduct, professionalism, and work performance were excellent throughout the internship.

In summary, I would like to express my strong support for them as a sincere and hardworking individual. I wholeheartedly recommend {{Name}} for any future academic or professional opportunities.

Sincerely,
Atul Kumar
Founder Zyntiq.`;

const PLACEHOLDER_HINT = "Use placeholders: {{Name}}, {{Role}}, {{Tenure}}, {{Date}}.";

export default function TemplateEditor({ onSubmit }: Props) {
  const [name, setName] = useState("Zyntiq Standard LOR");
  const [department, setDepartment] = useState("Human Resources");
  const [tenure, setTenure] = useState("1-2 Months");
  const [templateContent, setTemplateContent] = useState(DEFAULT_TEMPLATE);
  const [loading, setLoading] = useState(false);

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
      <h3 className="panel-title">Create Template</h3>

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

      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Template"}
      </button>
    </form>
  );
}