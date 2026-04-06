'use client';

import { Card, Badge } from '../../components/Ui';

export default function AdminDashboard() {
  return (
    <Card title="Administration console" subtitle="Centralized RBAC and user governance">
      <div className="grid-3">
        <div className="notice">Create and manage user accounts</div>
        <div className="notice">Assign and remove roles</div>
        <div className="notice">Review all policies and claims</div>
      </div>
      <div className="inline-actions" style={{ marginTop: 18 }}>
        <Badge tone="good">RBAC owned by admin</Badge>
        <Badge tone="warn">Separation of duties</Badge>
      </div>
    </Card>
  );
}
