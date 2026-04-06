'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { Card, Button, Input, Label, TextArea, StatusBadge } from '../../../components/Ui';
import { createPolicy, listPolicies } from '../../../lib/api';

export default function InternalPoliciesPage() {
  const { token } = useAuth();
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    if (token) listPolicies(token).then((result) => setPolicies(result.policies || []));
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await createPolicy(token, {
      policyNumber: form.get('policyNumber'),
      insuranceType: form.get('insuranceType'),
      customerId: form.get('customerId'),
      coverageAmount: form.get('coverageAmount'),
      premiumAmount: form.get('premiumAmount'),
      effectiveDate: form.get('effectiveDate'),
      expiryDate: form.get('expiryDate'),
      beneficiaryName: form.get('beneficiaryName'),
      vehicleInfo: form.get('vehicleInfo'),
      propertyAddress: form.get('propertyAddress')
    });
    setPolicies((current) => [result.policy, ...current]);
    event.currentTarget.reset();
  }

  return (
    <div className="stack">
      <Card title="Create policy" subtitle="Agent and admin servicing">
        <form className="grid-2" onSubmit={submit}>
          <div><Label>Policy number</Label><Input name="policyNumber" /></div>
          <div><Label>Insurance type</Label><Input name="insuranceType" placeholder="life, car, or home" /></div>
          <div><Label>Customer id</Label><Input name="customerId" /></div>
          <div><Label>Coverage amount</Label><Input name="coverageAmount" /></div>
          <div><Label>Premium amount</Label><Input name="premiumAmount" /></div>
          <div><Label>Effective date</Label><Input name="effectiveDate" type="date" /></div>
          <div><Label>Expiry date</Label><Input name="expiryDate" type="date" /></div>
          <div><Label>Beneficiary</Label><Input name="beneficiaryName" /></div>
          <div><Label>Vehicle info</Label><Input name="vehicleInfo" /></div>
          <div><Label>Property address</Label><Input name="propertyAddress" /></div>
          <div style={{ gridColumn: '1 / -1' }}><Button type="submit">Create policy</Button></div>
        </form>
      </Card>

      <Card title="All policies" subtitle="Protected inventory">
        <table className="table">
          <thead><tr><th>Number</th><th>Type</th><th>Customer</th><th>Coverage</th><th>Status</th></tr></thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.policyId}>
                <td>{policy.policyNumber}</td>
                <td>{policy.insuranceType}</td>
                <td>{policy.customerId}</td>
                <td>{policy.coverageAmount}</td>
                <td><StatusBadge status={policy.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
