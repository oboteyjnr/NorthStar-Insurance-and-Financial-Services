'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { Card, Button, Input, Label, TextArea, StatusBadge } from '../../../components/Ui';
import { listAmendments, reviewAmendment } from '../../../lib/api';

export default function InternalAmendmentsPage() {
  const { token } = useAuth();
  const [amendments, setAmendments] = useState([]);

  useEffect(() => {
    if (token) listAmendments(token).then((result) => setAmendments(result.amendments || []));
  }, [token]);

  async function decide(amendmentId, status) {
    const reviewComment = window.prompt('Review comment');
    const result = await reviewAmendment(token, amendmentId, { status, reviewComment });
    setAmendments((current) => current.map((item) => (item.amendmentId === amendmentId ? result.amendment : item)));
  }

  return (
    <Card title="Amendment reviews" subtitle="Underwriter decisioning">
      <table className="table">
        <thead><tr><th>Policy</th><th>Type</th><th>Requested</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {amendments.map((item) => (
            <tr key={item.amendmentId}>
              <td>{item.policyId}</td>
              <td>{item.requestType}</td>
              <td>{item.requestedValue}</td>
              <td><StatusBadge status={item.status} /></td>
              <td className="inline-actions">
                <Button onClick={() => decide(item.amendmentId, 'approved')}>Approve</Button>
                <Button variant="secondary" onClick={() => decide(item.amendmentId, 'rejected')}>Reject</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
