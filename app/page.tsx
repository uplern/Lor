import Link from "next/link";
import Image from "next/image";

/* ─── inline SVG icons ─── */

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5.2V11c0 5.3 3.4 10.1 8 11 4.6-.9 8-5.7 8-11V5.2L12 2Zm0 2.2 6 2.4V11c0 4.2-2.5 8-6 8.9-3.5-.9-6-4.7-6-8.9V6.6l6-2.4Z"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h7l5 5v15H7V2Zm2 2v16h8V8h-4V4H9Zm2 8h5v2h-5v-2Zm0 4h5v2h-5v-2Zm0-8h2v2h-2V8Z"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M13 2 5 14h6l-1 8 9-13h-6l1-7Z" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm10 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-2-2h2v2h-2v-2Z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 16l-5-5h3V4h4v7h3l-5 5Zm-8 2v2h16v-2H4Z"
      />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-7 14v-1c0-2.66 5.33-4 8-4 .6 0 1.3.07 2 .2a5.94 5.94 0 0 0-.73 1.9c-.42-.07-.85-.1-1.27-.1-2.97 0-6 1.47-6 2v1H2Zm17.5-4.5L16 19l-2.5-2.5 1.41-1.41L16 16.17l2.09-2.09 1.41 1.42Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1v3.49a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z"
      />
    </svg>
  );
}

const featureStrip = [
  { label: "Verified Records", icon: <ShieldIcon /> },
  { label: "Instant Download", icon: <DownloadIcon /> },
  { label: "QR Validated", icon: <QRIcon /> },
  { label: "Identity Check", icon: <UserCheckIcon /> },
  { label: "PDF Format", icon: <FileIcon /> },
  { label: "Fast Process", icon: <BoltIcon /> },
];

const uspSections = [
  {
    title: "Verified & Official Recommendations",
    text: "Every letter is generated directly from your official records maintained by Uplern. Our system ensures that the information in your LOR is accurate, authentic, and reflects your real contributions during your tenure. No manual edits, no guesswork. Just verified facts.",
    image: "/assets/section-mentorship.png",
    imageAlt: "Mentorship at Uplern",
  },
  {
    title: "QR-Secured Authenticity",
    text: "Each LOR is embedded with a unique QR code linked to your verification profile. Employers and universities can scan the QR to instantly validate your letter's authenticity. This digital seal of trust sets your application apart from the rest.",
    image: "/assets/section-verified.png",
    imageAlt: "Verified recommendation letter",
  },
  {
    title: "Professional, Print-Ready Documents",
    text: "Your recommendation letter is professionally formatted with Uplern's official branding, including the company logo, authorised signatures, and a clean layout ready for submission. Download a polished PDF that you can confidently attach to any application.",
    image: "/assets/section-document.png",
    imageAlt: "Professional document layout",
  },
];

export default function Home() {
  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="lp-hero" id="hero">
        {/* decorative swoosh */}
        <svg
          className="lp-hero-swoosh"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="var(--accent)"
            fillOpacity="0.12"
            d="M0,224L80,208C160,192,320,160,480,170.7C640,181,800,235,960,240C1120,245,1280,203,1360,181.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,0,0Z"
          />
        </svg>

        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <h1>Your Letter of Recommendation,<br />One Click Away</h1>
            <p>
              Verify your identity and instantly download your organisation-approved
              recommendation letter. It is professionally formatted, QR-secured, and ready
              to impress.
            </p>
            <div className="lp-hero-actions">
              <div className="lp-hero-btn-wrap">
                <Link href="/verify">
                  Check LOR
                </Link>
              </div>
            </div>
          </div>

          <div className="lp-hero-collage">
            <div className="hex-wrapper hex-main">
              <Image
                src="/assets/hero.png"
                alt="Team celebrating achievement"
                width={480}
                height={360}
                priority
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="hex-wrapper hex-accent hex-small-1">
              <Image
                src="/assets/section-mentorship.png"
                alt="Mentoring"
                width={180}
                height={135}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="hex-wrapper hex-accent hex-small-2">
              <Image
                src="/assets/section-verified.png"
                alt="Verified"
                width={150}
                height={113}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE STRIP ─── */}
      <section className="lp-feature-strip" id="how-it-works">
        <div className="lp-feature-strip-inner">
          {featureStrip.map((item) => (
            <div className="lp-feature-chip" key={item.label}>
              <span className="lp-feature-chip-icon">{item.icon}</span>
              <span className="lp-feature-chip-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── USP SECTIONS (zigzag) ─── */}
      {uspSections.map((usp, idx) => (
        <section
          className={`lp-usp ${idx % 2 !== 0 ? "lp-usp-reverse" : ""}`}
          key={usp.title}
        >
          <div className="lp-usp-inner">
            <div className="lp-usp-image">
              <div className="hex-wrapper hex-usp">
                <Image
                  src={usp.image}
                  alt={usp.imageAlt}
                  width={440}
                  height={330}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </div>
            <div className="lp-usp-text">
              <h2>{usp.title}</h2>
              <p>{usp.text}</p>
              <Link className="lp-read-more" href="/verify">
                Get Started
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* ─── CONTACT / CTA ─── */}
      <section className="lp-contact" id="contact">
        <div className="lp-contact-inner">
          <div className="lp-contact-info">
            <h2>Have a Question? Contact Us</h2>
            <p>
              Reach out to the Uplern team for any queries about your internship,
              recommendation letter, or verification process.
            </p>
            <ul className="lp-contact-list">
              <li>
                <PhoneIcon />
                <span>+91-XXXX-XXXXXX</span>
              </li>
              <li>
                <MailIcon />
                <span>info@uplern.uk</span>
              </li>
              <li>
                <MapPinIcon />
                <span>Remote, United Kingdom</span>
              </li>
            </ul>
          </div>

          <div className="lp-contact-cta-card">
            <h3>Ready to get your LOR?</h3>
            <p>Verify your identity now and download your professionally formatted letter in minutes.</p>
            <Link className="btn lp-btn-primary" href="/verify">
              Get Your LOR Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <Image
            src="/assets/white_logo.png"
            alt="Uplern"
            width={100}
            height={28}
            style={{ objectFit: "contain" }}
          />
          <p>© {new Date().getFullYear()} Uplern Pvt Ltd. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}