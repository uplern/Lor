export type TemplateRow = {
  id: string;
  name: string;
  department: string;
  tenure: string | null;
  template_content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LORUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  tenure: string;
  template_id: string;
  token: string | null;
  created_at: string;
  updated_at: string;
};

export type VerifyResponse = {
  user: {
    name: string;
    email: string;
    role: string;
    tenure: string;
  };
  template: {
    name: string;
    department: string;
  };
  content: string;
};