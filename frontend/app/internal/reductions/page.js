'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { Card, Button, StatusBadge } from '../../../components/Ui';
import { listReductions, reviewReduction } from '../../../lib/api';

export default function InternalReductionsPage() {
  const { token } = useAuth();
  const [reductions, setReductions] = useState([]);

  useEffect(() => {
    if (token) listReductions(token).then((result) => setReductions(result.reductions || []));
  }, [token]);

  async function decide(reductionId, status) {
    const reviewComment = window.prompt('Review comment');
    const result = await reviewReduction(token, reductionId, { status, reviewComment });
    setReductions((current) => current.map((item) => (item.reductionId === reductionId ? result.reduction : item)));
  }

  return (
    <Card title="Reduction reviews" subtitle="Underwriter decisioning">
      <table className="table">
        <thead><tr><th>Policy</th><th>Current</th><th>Requested</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {reductions.map((item) => (
            <tr key={item.reductionId}>
              <td>{item.policyId}</td>
              <td>{item.currentCoverage}</td>
              <td>{item.requestedCoverage}</td>
              <td><StatusBadge status={item.status} /></td>
              <td className="inline-actions">
                <Button onClick={() => decide(item.reductionId, 'approved')}>Approve</Button>
                <Button variant="secondary" onClick={() => decide(item.reductionId, 'rejected')}>Reject</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
