'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { Card, Button, Input, Label, TextArea, StatusBadge } from '../../../components/Ui';
import { createAmendment, listAmendments, listPolicies } from '../../../lib/api';

export default function CustomerAmendmentsPage() {
  const { token } = useAuth();
  const [amendments, setAmendments] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([listAmendments(token), listPolicies(token)]).then(([amendmentResult, policyResult]) => {
      setAmendments(amendmentResult.amendments || []);
      setPolicies(policyResult.policies || []);
    });
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await createAmendment(token, {
      policyId: form.get('policyId'),
      requestType: form.get('requestType'),
      currentValue: form.get('currentValue'),
      requestedValue: form.get('requestedValue'),
      reason: form.get('reason')
    });
    setAmendments((current) => [result.amendment, ...current]);
    event.currentTarget.reset();
  }

  return (
    <div className="stack">
      <Card title="Request an amendment" subtitle="Customer submitted request">
        <form className="grid-2" onSubmit={submit}>
          <div><Label>Policy</Label><Input name="policyId" placeholder="Policy id" /></div>
          <div><Label>Request type</Label><Input name="requestType" placeholder="coverage-increase" /></div>
          <div><Label>Current value</Label><Input name="currentValue" /></div>
          <div><Label>Requested value</Label><Input name="requestedValue" /></div>
          <div style={{ gridColumn: '1 / -1' }}><Label>Reason</Label><TextArea name="reason" /></div>
          <div style={{ gridColumn: '1 / -1' }}><Button type="submit">Submit amendment</Button></div>
        </form>
      </Card>

      <Card title="Submitted amendments" subtitle="Status tracking">
        <table className="table">
          <thead><tr><th>Policy</th><th>Type</th><th>Requested</th><th>Status</th></tr></thead>
          <tbody>
            {amendments.map((item) => (
              <tr key={item.amendmentId}>
                <td>{item.policyId}</td>
                <td>{item.requestType}</td>
                <td>{item.requestedValue}</td>
                <td><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
