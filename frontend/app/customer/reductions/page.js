'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { Card, Button, Input, Label, TextArea, StatusBadge } from '../../../components/Ui';
import { createReduction, listPolicies, listReductions } from '../../../lib/api';

export default function CustomerReductionsPage() {
  const { token } = useAuth();
  const [reductions, setReductions] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([listReductions(token), listPolicies(token)]).then(([reductionResult, policyResult]) => {
      setReductions(reductionResult.reductions || []);
      setPolicies(policyResult.policies || []);
    });
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await createReduction(token, {
      policyId: form.get('policyId'),
      currentCoverage: form.get('currentCoverage'),
      requestedCoverage: form.get('requestedCoverage'),
      reason: form.get('reason')
    });
    setReductions((current) => [result.reduction, ...current]);
    event.currentTarget.reset();
  }

  return (
    <div className="stack">
      <Card title="Request a coverage reduction" subtitle="Customer service request">
        <form className="grid-2" onSubmit={submit}>
          <div><Label>Policy</Label><Input name="policyId" placeholder="Policy id" /></div>
          <div><Label>Current coverage</Label><Input name="currentCoverage" /></div>
          <div><Label>Requested coverage</Label><Input name="requestedCoverage" /></div>
          <div style={{ gridColumn: '1 / -1' }}><Label>Reason</Label><TextArea name="reason" /></div>
          <div style={{ gridColumn: '1 / -1' }}><Button type="submit">Submit reduction</Button></div>
        </form>
      </Card>

      <Card title="Reduction requests" subtitle="Protected status view">
        <table className="table">
          <thead><tr><th>Policy</th><th>Current</th><th>Requested</th><th>Status</th></tr></thead>
          <tbody>
            {reductions.map((item) => (
              <tr key={item.reductionId}>
                <td>{item.policyId}</td>
                <td>{item.currentCoverage}</td>
                <td>{item.requestedCoverage}</td>
                <td><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
