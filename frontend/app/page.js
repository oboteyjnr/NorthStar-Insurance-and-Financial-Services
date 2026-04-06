import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="hero-wrap">
      <div className="hero-grid" style={{ width: 'min(1200px, 100%)' }}>
        <section className="hero-card">
          <p className="eyebrow">NorthStar Insurance & Financial Services</p>
          <h1 className="hero-title">Secure digital insurance operations for customers and internal staff.</h1>
          <p className="copy" style={{ maxWidth: 640 }}>
            This lab platform demonstrates HTTPS, JWT authentication, RBAC, ownership checks, and role-specific workflows for life, car, and home insurance.
          </p>
          <div className="hero-actions" style={{ marginTop: 24 }}>
            <Link className="button" href="/login">Sign in</Link>
            <Link className="button-secondary" href="/customer">Customer portal</Link>
            <Link className="button-secondary" href="/internal">Internal portal</Link>
            <Link className="button-secondary" href="/admin">Admin portal</Link>
          </div>
        </section>

        <section className="panel">
          <div className="stack">
            <div>
              <div className="caption">Business coverage</div>
              <h2 className="title" style={{ fontSize: '1.8rem' }}>Life, car, and home insurance in one platform.</h2>
            </div>

            <div className="grid-2">
              <div className="metric">
                <span className="metric-label">Customer portal</span>
                <span className="metric-value">Own data only</span>
              </div>
              <div className="metric">
                <span className="metric-label">Internal portal</span>
                <span className="metric-value">Review and service</span>
              </div>
              <div className="metric">
                <span className="metric-label">Admin portal</span>
                <span className="metric-value">RBAC control</span>
              </div>
              <div className="metric">
                <span className="metric-label">Transport security</span>
                <span className="metric-value">HTTPS everywhere</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
