'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import { Card, Badge } from '../../components/Ui';
import { listPolicies, listClaims, listAmendments, listReductions } from '../../lib/api';

export default function CustomerDashboard() {
  const { token, user } = useAuth();
  const [snapshot, setSnapshot] = useState({ policies: [], claims: [], amendments: [], reductions: [] });

  useEffect(() => {
    async function load() {
      const [policiesResult, claimsResult, amendmentsResult, reductionsResult] = await Promise.all([
        listPolicies(token),
        listClaims(token),
        listAmendments(token),
        listReductions(token)
      ]);

      setSnapshot({
        policies: policiesResult.policies || [],
        claims: claimsResult.claims || [],
        amendments: amendmentsResult.amendments || [],
        reductions: reductionsResult.reductions || []
      });
    }

    if (token) {
      load();
    }
  }, [token]);

  return (
    <div className="stack">
      <Card title={`Welcome back, ${user.firstName}.`} subtitle="Customer summary">
        <div className="dashboard-grid">
          <div className="metric"><span className="metric-label">Policies</span><span className="metric-value">{snapshot.policies.length}</span></div>
          <div className="metric"><span className="metric-label">Claims</span><span className="metric-value">{snapshot.claims.length}</span></div>
          <div className="metric"><span className="metric-label">Amendments</span><span className="metric-value">{snapshot.amendments.length}</span></div>
          <div className="metric"><span className="metric-label">Reductions</span><span className="metric-value">{snapshot.reductions.length}</span></div>
        </div>
      </Card>

      <Card title="Policy mix" subtitle="Owned policies">
        <div className="kpi-list">
          {snapshot.policies.map((policy) => (
            <div className="kpi" key={policy.policyId}>
              <div>
                <div style={{ fontWeight: 700 }}>{policy.policyNumber}</div>
                <div className="caption">{policy.insuranceType} coverage</div>
              </div>
              <Badge>{policy.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
