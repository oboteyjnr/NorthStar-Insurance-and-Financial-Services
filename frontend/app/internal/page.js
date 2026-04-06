'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import { Card, Badge } from '../../components/Ui';
import { listPolicies, listClaims, listAmendments, listReductions } from '../../lib/api';

export default function InternalDashboard() {
  const { token, user } = useAuth();
  const [counts, setCounts] = useState({ policies: 0, claims: 0, amendments: 0, reductions: 0 });

  useEffect(() => {
    if (!token) return;
    Promise.all([listPolicies(token), listClaims(token), listAmendments(token), listReductions(token)]).then(([p, c, a, r]) => {
      setCounts({
        policies: p.policies?.length || 0,
        claims: c.claims?.length || 0,
        amendments: a.amendments?.length || 0,
        reductions: r.reductions?.length || 0
      });
    });
  }, [token]);

  return (
    <Card title={`Operations dashboard for ${user.firstName}.`} subtitle="Internal control room">
      <div className="dashboard-grid">
        <div className="metric"><span className="metric-label">Policies</span><span className="metric-value">{counts.policies}</span></div>
        <div className="metric"><span className="metric-label">Claims</span><span className="metric-value">{counts.claims}</span></div>
        <div className="metric"><span className="metric-label">Amendments</span><span className="metric-value">{counts.amendments}</span></div>
        <div className="metric"><span className="metric-label">Reductions</span><span className="metric-value">{counts.reductions}</span></div>
      </div>
      <div className="inline-actions" style={{ marginTop: 18 }}>
        <Badge>Role-bound access</Badge>
        <Badge tone="good">HTTPS</Badge>
        <Badge tone="warn">JWT protected</Badge>
      </div>
    </Card>
  );
}
