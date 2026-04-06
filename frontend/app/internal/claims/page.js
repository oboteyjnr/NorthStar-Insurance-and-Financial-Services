'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { Card, Button, StatusBadge } from '../../../components/Ui';
import { listClaims, reviewClaim } from '../../../lib/api';

export default function InternalClaimsPage() {
  const { token } = useAuth();
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (token) listClaims(token).then((result) => setClaims(result.claims || []));
  }, [token]);

  async function decide(claimId, status) {
    const decisionComment = window.prompt('Decision comment');
    const result = await reviewClaim(token, claimId, { status, decisionComment });
    setClaims((current) => current.map((item) => (item.claimId === claimId ? result.claim : item)));
  }

  return (
    <Card title="Claims review" subtitle="Claims adjuster decisioning">
      <table className="table">
        <thead><tr><th>Policy</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {claims.map((item) => (
            <tr key={item.claimId}>
              <td>{item.policyId}</td>
              <td>{item.claimType}</td>
              <td>{item.claimAmount}</td>
              <td><StatusBadge status={item.status} /></td>
              <td className="inline-actions">
                <Button onClick={() => decide(item.claimId, 'approved')}>Approve</Button>
                <Button variant="secondary" onClick={() => decide(item.claimId, 'rejected')}>Reject</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
