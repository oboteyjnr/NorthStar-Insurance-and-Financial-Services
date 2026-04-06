'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../app/providers';
import { Button, Badge } from './Ui';
import { resolveHomeRoute } from '../lib/api';

export default function PortalLayout({ title, allowedRoles, links, children }) {
  const { token, user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!token || !user) {
      router.replace('/login');
      return;
    }

    const allowed = allowedRoles.some((role) => user.roles?.includes(role));
    if (!allowed) {
      router.replace(resolveHomeRoute(user));
    }
  }, [ready, token, user, allowedRoles, router]);

  if (!ready || !token || !user) {
    return <div className="login-wrap"><div className="notice">Loading secure session...</div></div>;
  }

  const allowed = allowedRoles.some((role) => user.roles?.includes(role));
  if (!allowed) {
    return <div className="login-wrap"><div className="notice">Redirecting...</div></div>;
  }

  return (
    <div className="shell">
      <div className="portal-grid">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">N</div>
            <div>
              <div className="brand-title">NorthStar</div>
              <div className="caption">Insurance platform</div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div className="caption">Signed in as</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{user.firstName} {user.lastName}</div>
            <div className="inline-actions" style={{ marginTop: 10 }}>
              {(user.roles || []).map((role) => <Badge key={role}>{role}</Badge>)}
            </div>
          </div>

          <nav>
            <ul className="nav-list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link className={`nav-link ${pathname === link.href ? 'active' : ''}`} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ marginTop: 18 }}>
            <Button variant="secondary" onClick={logout} style={{ width: '100%' }}>
              Sign out
            </Button>
          </div>
        </aside>

        <main className="content">
          <div className="topbar">
            <div>
              <p className="eyebrow">{title}</p>
              <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.3rem)' }}>{title}</h1>
            </div>
            <div className="notice small">Protected session and role-bound navigation</div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
