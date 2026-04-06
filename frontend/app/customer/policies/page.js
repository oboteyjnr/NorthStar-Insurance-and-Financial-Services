'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { listPolicies } from '../../../lib/api';
import { Card, StatusBadge } from '../../../components/Ui';

export default function CustomerPoliciesPage() {
  const { token } = useAuth();
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    if (token) {
      listPolicies(token).then((result) => setPolicies(result.policies || []));
    }
  }, [token]);

  return (
    <Card title="My policies" subtitle="Owned insurance policies">
      <table className="table">
        <thead>
          <tr>
            <th>Policy</th>
            <th>Type</th>
            <th>Coverage</th>
            <th>Premium</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.policyId}>
              <td>{policy.policyNumber}</td>
              <td>{policy.insuranceType}</td>
              <td>{policy.coverageAmount} {policy.currency}</td>
              <td>{policy.premiumAmount} {policy.currency}</td>
              <td><StatusBadge status={policy.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
