'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../providers';
import { getUser, listRoles, assignRole, removeRole, updateUser } from '../../../../lib/api';
import { Card, Button, Input, Label, Select, StatusBadge } from '../../../../components/Ui';

export default function AdminUserDetailsPage() {
  const { token } = useAuth();
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!token || !params.userId) return;
    Promise.all([getUser(token, params.userId), listRoles(token)]).then(([userResult, rolesResult]) => {
      setProfile(userResult.profile);
      setRoles(rolesResult.roles || []);
    });
  }, [token, params.userId]);

  async function save(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await updateUser(token, params.userId, {
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      email: form.get('email'),
      phoneNumber: form.get('phoneNumber'),
      department: form.get('department'),
      jobTitle: form.get('jobTitle'),
      status: form.get('status')
    });
    setProfile(result.profile);
  }

  async function addRole(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await assignRole(token, params.userId, form.get('role'));
    setProfile(result.profile);
  }

  async function deleteRole(role) {
    const result = await removeRole(token, params.userId, role);
    setProfile(result.profile);
  }

  if (!profile) return <Card title="User details">Loading...</Card>;

  return (
    <div className="stack">
      <Card title="Edit user profile" subtitle="Admin-controlled fields">
        <form className="grid-2" onSubmit={save}>
          <div><Label>First name</Label><Input name="firstName" defaultValue={profile.firstName} /></div>
          <div><Label>Last name</Label><Input name="lastName" defaultValue={profile.lastName} /></div>
          <div><Label>Email</Label><Input name="email" defaultValue={profile.email} /></div>
          <div><Label>Phone</Label><Input name="phoneNumber" defaultValue={profile.phoneNumber} /></div>
          <div><Label>Department</Label><Input name="department" defaultValue={profile.department} /></div>
          <div><Label>Job title</Label><Input name="jobTitle" defaultValue={profile.jobTitle} /></div>
          <div><Label>Status</Label><Select name="status" defaultValue={profile.status}><option value="active">active</option><option value="inactive">inactive</option><option value="suspended">suspended</option></Select></div>
          <div style={{ gridColumn: '1 / -1' }}><Button type="submit">Save profile</Button></div>
        </form>
      </Card>

      <Card title="Role assignment" subtitle="Centralized RBAC control">
        <form className="inline-actions" onSubmit={addRole}>
          <Select name="role" defaultValue={(profile.roles && profile.roles[0]) || roles[0] || ''}>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </Select>
          <Button type="submit">Assign role</Button>
        </form>

        <div className="inline-actions" style={{ marginTop: 18 }}>
          {(profile.roles || []).map((role) => (
            <Button key={role} variant="secondary" onClick={() => deleteRole(role)}>{role}</Button>
          ))}
          <StatusBadge status={profile.status} />
        </div>
      </Card>
    </div>
  );
}
