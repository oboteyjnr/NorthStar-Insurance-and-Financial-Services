'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../providers';
import { listUsers, toggleUserStatus } from '../../../lib/api';
import { Card, Button, StatusBadge } from '../../../components/Ui';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      listUsers(token)
        .then((result) => setUsers(result.users || []))
        .catch((loadError) => setError(loadError.message || 'Unable to load users.'));
    }
  }, [token]);

  async function changeStatus(userId, status) {
    setError('');
    try {
      await toggleUserStatus(token, userId, status);
      const result = await listUsers(token);
      setUsers(result.users || []);
    } catch (statusError) {
      setError(statusError.message || 'Unable to update status.');
    }
  }

  return (
    <Card
      title="Users"
      subtitle="Admin identity management"
      actions={<Link className="button" href="/admin/users/create">Create user</Link>}
    >
      <table className="table">
        <thead><tr><th>Username</th><th>Full name</th><th>Email</th><th>Roles</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.username}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email || '-'}</td>
              <td>{(user.roles || []).join(', ')}</td>
              <td><StatusBadge status={user.status} /></td>
              <td className="inline-actions">
                <Link className="button-secondary" href={`/admin/users/${user.userId}/edit`}>Edit</Link>
                <Link className="button-secondary" href="/admin/rbac">Manage roles</Link>
                <Link className="button-secondary" href="/admin/account-status">Manage status</Link>
                {user.status === 'active' ? (
                  <Button variant="secondary" onClick={() => changeStatus(user.userId, 'suspended')}>Suspend</Button>
                ) : (
                  <Button onClick={() => changeStatus(user.userId, 'active')}>Activate</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error ? <div className="notice" style={{ color: 'var(--danger)', marginTop: 14 }}>{error}</div> : null}
    </Card>
  );
}
