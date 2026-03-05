import Link from "next/link";

export default function AdminNav() {
  return (
    <div className="admin-nav">
      <div className="admin-links">
        <Link className="btn secondary" href="/admin/dashboard">
          Dashboard
        </Link>
        <Link className="btn secondary" href="/admin/templates">
          Templates
        </Link>
        <Link className="btn secondary" href="/admin/users">
          Users
        </Link>
      </div>
      <Link className="btn" href="/api/auth/signout">
        Sign out
      </Link>
    </div>
  );
}