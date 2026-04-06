'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { Card, Button, Input, Label, TextArea, StatusBadge } from '../../../components/Ui';
import { createClaim, listClaims, listPolicies } from '../../../lib/api';

export default function CustomerClaimsPage() {
  const { token } = useAuth();
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([listClaims(token), listPolicies(token)]).then(([claimResult, policyResult]) => {
      setClaims(claimResult.claims || []);
      setPolicies(policyResult.policies || []);
    });
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await createClaim(token, {
      policyId: form.get('policyId'),
      claimType: form.get('claimType'),
      incidentDate: form.get('incidentDate'),
      claimAmount: form.get('claimAmount'),
      description: form.get('description')
    });
    setClaims((current) => [result.claim, ...current]);
    event.currentTarget.reset();
  }

  return (
    <div className="stack">
      <Card title="Submit a claim" subtitle="Claims request">
        <form className="grid-2" onSubmit={submit}>
          <div><Label>Policy</Label><Input name="policyId" placeholder="Policy id" /></div>
          <div><Label>Claim type</Label><Input name="claimType" placeholder="property-damage" /></div>
          <div><Label>Incident date</Label><Input name="incidentDate" type="date" /></div>
          <div><Label>Claim amount</Label><Input name="claimAmount" /></div>
          <div style={{ gridColumn: '1 / -1' }}><Label>Description</Label><TextArea name="description" /></div>
          <div style={{ gridColumn: '1 / -1' }}><Button type="submit">Submit claim</Button></div>
        </form>
      </Card>

      <Card title="My claims" subtitle="Status and decision tracking">
        <table className="table">
          <thead><tr><th>Policy</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {claims.map((item) => (
              <tr key={item.claimId}>
                <td>{item.policyId}</td>
                <td>{item.claimType}</td>
                <td>{item.claimAmount}</td>
                <td><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
