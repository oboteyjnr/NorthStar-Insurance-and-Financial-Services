'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../providers';
import { createUser } from '../../../../lib/api';
import { Button, Card, Input, Label, Select } from '../../../../components/Ui';

const availableRoles = ['customer', 'insurance-agent', 'underwriter', 'claims-adjuster', 'customer-service', 'compliance-officer', 'admin'];

export default function AdminCreateUserPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');

    const form = new FormData(event.currentTarget);
    const body = {
      username: String(form.get('username') || ''),
      password: String(form.get('password') || ''),
      firstName: String(form.get('firstName') || ''),
      lastName: String(form.get('lastName') || ''),
      email: String(form.get('email') || ''),
      phoneNumber: String(form.get('phoneNumber') || ''),
      city: String(form.get('city') || ''),
      country: String(form.get('country') || ''),
      userType: String(form.get('userType') || 'customer'),
      status: String(form.get('status') || 'active'),
      roles: form.getAll('roles')
    };

    if (!body.username || !body.password || !body.firstName || !body.lastName || !body.email || !body.userType) {
      setError('Please complete all required fields.');
      return;
    }

    if (!body.roles.length) {
      setError('At least one role must be selected.');
      return;
    }

    try {
      setSaving(true);
      const result = await createUser(token, body);
      router.push(`/admin/users/${result.profile.userId}/edit`);
    } catch (submitError) {
      setError(submitError.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Create user" subtitle="Administrative account provisioning">
      <form className="grid-2" onSubmit={submit}>
        <div><Label>Username*</Label><Input name="username" required /></div>
        <div><Label>Password*</Label><Input name="password" type="password" required /></div>
        <div><Label>First name*</Label><Input name="firstName" required /></div>
        <div><Label>Last name*</Label><Input name="lastName" required /></div>
        <div><Label>Email*</Label><Input name="email" type="email" required /></div>
        <div><Label>Phone</Label><Input name="phoneNumber" /></div>
        <div><Label>City</Label><Input name="city" /></div>
        <div><Label>Country</Label><Input name="country" /></div>
        <div>
          <Label>User type*</Label>
          <Select name="userType" defaultValue="customer">
            <option value="customer">customer</option>
            <option value="internal">internal</option>
          </Select>
        </div>
        <div>
          <Label>Account status</Label>
          <Select name="status" defaultValue="active">
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="suspended">suspended</option>
          </Select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <Label>Roles*</Label>
          <div className="inline-actions" style={{ marginTop: 8 }}>
            {availableRoles.map((role, index) => (
              <label key={role} className="badge" style={{ cursor: 'pointer' }}>
                <input type="checkbox" name="roles" value={role} defaultChecked={index === 0} style={{ marginRight: 8 }} />
                {role}
              </label>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }} className="inline-actions">
          <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create user'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/users')}>Cancel</Button>
        </div>
      </form>

      {error ? <div className="notice" style={{ color: 'var(--danger)', marginTop: 14 }}>{error}</div> : null}
    </Card>
  );
}
