'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../providers';
import { listUsers, toggleUserStatus } from '../../../lib/api';
import { Card, Button, StatusBadge } from '../../../components/Ui';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (token) listUsers(token).then((result) => setUsers(result.users || []));
  }, [token]);

  async function changeStatus(userId, status) {
    await toggleUserStatus(token, userId, status);
    const result = await listUsers(token);
    setUsers(result.users || []);
  }

  return (
    <Card title="Users" subtitle="Admin identity management">
      <table className="table">
        <thead><tr><th>User</th><th>Type</th><th>Status</th><th>Roles</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td><Link href={`/admin/users/${user.userId}`}>{user.firstName} {user.lastName}</Link></td>
              <td>{user.userType}</td>
              <td><StatusBadge status={user.status} /></td>
              <td>{(user.roles || []).join(', ')}</td>
              <td className="inline-actions">
                <Button variant="secondary" onClick={() => changeStatus(user.userId, 'inactive')}>Deactivate</Button>
                <Button onClick={() => changeStatus(user.userId, 'active')}>Activate</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
