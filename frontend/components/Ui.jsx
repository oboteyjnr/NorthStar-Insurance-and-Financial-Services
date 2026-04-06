'use client';

import { useMemo } from 'react';

export function Card({ title, subtitle, children, actions }) {
  return (
    <section className="panel">
      {(title || subtitle || actions) && (
        <div className="topbar" style={{ marginBottom: 16 }}>
          <div>
            {subtitle ? <p className="eyebrow">{subtitle}</p> : null}
            {title ? <h2 className="title" style={{ fontSize: '1.6rem' }}>{title}</h2> : null}
          </div>
          {actions ? <div className="inline-actions">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export function Button({ children, variant = 'primary', ...props }) {
  const className = useMemo(() => {
    if (variant === 'secondary') return 'button-secondary';
    if (variant === 'danger') return 'button-danger';
    return 'button';
  }, [variant]);

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export function Input(props) {
  return <input className="field" {...props} />;
}

export function TextArea(props) {
  return <textarea className="textarea" {...props} />;
}

export function Select(props) {
  return <select className="select" {...props} />;
}

export function Label({ children }) {
  return <label className="caption">{children}</label>;
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function StatusBadge({ status }) {
  const tone = status === 'approved' || status === 'active' ? 'good' : status === 'rejected' || status === 'inactive' ? 'bad' : 'warn';
  return <Badge tone={tone}>{status}</Badge>;
}
