'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { listRoles, listUsers, replaceRoles } from '../../../lib/api';
import { Button, Card, Select } from '../../../components/Ui';

export default function AdminRbacPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }

    Promise.all([listUsers(token), listRoles(token)])
      .then(([usersResult, rolesResult]) => {
        const loadedUsers = usersResult.users || [];
        const loadedRoles = rolesResult.roles || [];

        setUsers(loadedUsers);
        setRoles(loadedRoles);

        if (loadedUsers.length > 0) {
          setUserId(loadedUsers[0].userId);
          setSelectedRoles(loadedUsers[0].roles || []);
        }
      })
      .catch((loadError) => setError(loadError.message || 'Unable to load RBAC data.'));
  }, [token]);

  function changeUser(nextUserId) {
    setUserId(nextUserId);
    const selectedUser = users.find((user) => user.userId === nextUserId);
    setSelectedRoles(selectedUser?.roles || []);
    setError('');
    setSuccess('');
  }

  function toggleRole(role) {
    setSelectedRoles((current) => {
      if (current.includes(role)) {
        return current.filter((item) => item !== role);
      }

      return [...current, role];
    });
  }

  async function save() {
    setError('');
    setSuccess('');

    if (!userId) {
      setError('Please select a user.');
      return;
    }

    if (selectedRoles.length === 0) {
      setError('At least one role must be selected.');
      return;
    }

    try {
      await replaceRoles(token, userId, selectedRoles);
      const result = await listUsers(token);
      setUsers(result.users || []);
      setSuccess('Roles updated successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to update roles.');
    }
  }

  return (
    <Card title="Role assignment and revocation" subtitle="Assign roles, revoke roles, then save and refresh">
      <div className="grid-2">
        <div>
          <div className="caption">Select user</div>
          <Select value={userId} onChange={(event) => changeUser(event.target.value)}>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>{user.username}</option>
            ))}
          </Select>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div className="caption">Roles</div>
        <div className="inline-actions" style={{ marginTop: 8 }}>
          {roles.map((role) => (
            <label key={role} className="badge" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
                style={{ marginRight: 8 }}
              />
              {role}
            </label>
          ))}
        </div>
      </div>

      <div className="inline-actions" style={{ marginTop: 18 }}>
        <Button onClick={save}>Save roles</Button>
      </div>

      {error ? <div className="notice" style={{ color: 'var(--danger)', marginTop: 14 }}>{error}</div> : null}
      {success ? <div className="notice" style={{ color: 'var(--success)', marginTop: 14 }}>{success}</div> : null}
    </Card>
  );
}
