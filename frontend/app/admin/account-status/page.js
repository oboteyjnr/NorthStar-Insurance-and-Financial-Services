'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { listUsers, toggleUserStatus } from '../../../lib/api';
import { Button, Card, Select, StatusBadge } from '../../../components/Ui';

export default function AdminAccountStatusPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [draftStatus, setDraftStatus] = useState({});
  const [error, setError] = useState('');

  async function refresh() {
    try {
      const result = await listUsers(token);
      const nextUsers = result.users || [];
      setUsers(nextUsers);
      setDraftStatus(Object.fromEntries(nextUsers.map((user) => [user.userId, user.status])));
    } catch (loadError) {
      setError(loadError.message || 'Unable to load users.');
    }
  }

  useEffect(() => {
    if (token) {
      refresh();
    }
  }, [token]);

  async function changeStatus(userId, status) {
    setError('');
    try {
      await toggleUserStatus(token, userId, status);
      await refresh();
    } catch (statusError) {
      setError(statusError.message || 'Unable to update status.');
    }
  }

  return (
    <Card title="Account status management" subtitle="Set ACTIVE, INACTIVE, or SUSPENDED for users">
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Current status</th>
            <th>Update status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.username}</td>
              <td><StatusBadge status={user.status} /></td>
              <td>
                <div className="inline-actions">
                  <Select value={draftStatus[user.userId] || user.status} onChange={(event) => setDraftStatus((current) => ({ ...current, [user.userId]: event.target.value }))}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="suspended">suspended</option>
                  </Select>
                  <Button variant="secondary" onClick={() => changeStatus(user.userId, draftStatus[user.userId] || user.status)}>Save</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error ? <div className="notice" style={{ color: 'var(--danger)' }}>{error}</div> : null}
    </Card>
  );
}
