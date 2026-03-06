import Link from "next/link";
import Image from "next/image";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5.2V11c0 5.3 3.4 10.1 8 11 4.6-.9 8-5.7 8-11V5.2L12 2Zm0 2.2 6 2.4V11c0 4.2-2.5 8-6 8.9-3.5-.9-6-4.7-6-8.9V6.6l6-2.4Z"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h7l5 5v15H7V2Zm2 2v16h8V8h-4V4H9Zm2 8h5v2h-5v-2Zm0 4h5v2h-5v-2Zm0-8h2v2h-2V8Z"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M13 2 5 14h6l-1 8 9-13h-6l1-7Z" />
    </svg>
  );
}

const points = [
  {
    title: "Verified & Secure",
    text: "Letters are generated from official records only.",
    icon: <ShieldIcon />
  },
  {
    title: "Professional Format",
    text: "Company logo, sign-off, and seal-ready document output.",
    icon: <FileIcon />
  },
  {
    title: "Fast Process",
    text: "Verify details and download your LOR in minutes.",
    icon: <BoltIcon />
  }
];

export default function Home() {
  return (
    <main className="container page">
      <section className="hero clean-hero">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <div className="hero-badge">Official Zyntiq Portal</div>
            <h1>Get Your Letter of Recommendation</h1>
            <p>
              Verify your details and download your organization-approved recommendation letter with a
              clean and reliable process.
            </p>
            <div className="hero-actions">
              <Link className="btn" href="/verify">
                Get LOR
              </Link>
            </div>
          </div>
          <div className="hero-illustration">
            <Image
              src="/gd1.svg"
              alt="LOR Illustration"
              width={400}
              height={300}
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </section>

      <section className="grid three" style={{ marginTop: "1rem" }}>
        {points.map((item) => (
          <article className="card feature-card" key={item.title}>
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p className="muted">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="grid two" style={{ marginTop: "1rem" }}>
        <article className="card">
          <h2 className="panel-title">About Zyntiq</h2>
          <p className="muted" style={{ margin: 0 }}>
            Zyntiq helps interns build practical skills through real work, mentorship, and clear
            performance expectations.
          </p>
        </article>

        <article className="card">
          <h2 className="panel-title">Why This LOR Helps</h2>
          <p className="muted" style={{ margin: 0 }}>
            Your LOR is professionally formatted, officially verified, and ready for applications.
          </p>
        </article>
      </section>
    </main>
  );
}