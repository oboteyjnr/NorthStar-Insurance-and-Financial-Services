'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { listRoles } from '../../../lib/api';
import { Card, Badge } from '../../../components/Ui';

export default function AdminRolesPage() {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (token) listRoles(token).then((result) => setRoles(result.roles || []));
  }, [token]);

  return (
    <Card title="Available roles" subtitle="Current RBAC catalog">
      <div className="inline-actions">
        {roles.map((role) => <Badge key={role}>{role}</Badge>)}
      </div>
    </Card>
  );
}
