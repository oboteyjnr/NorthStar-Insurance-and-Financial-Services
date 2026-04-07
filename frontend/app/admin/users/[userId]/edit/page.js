'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../providers';
import { getUser, updateUser } from '../../../../../lib/api';
import { Button, Card, Input, Label, Select, StatusBadge } from '../../../../../components/Ui';

export default function AdminEditUserPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !params.userId) {
      return;
    }

    getUser(token, params.userId)
      .then((result) => setProfile(result.profile))
      .catch((loadError) => setError(loadError.message || 'Unable to load user.'));
  }, [token, params.userId]);

  async function save(event) {
    event.preventDefault();
    setError('');

    const form = new FormData(event.currentTarget);
    try {
      const result = await updateUser(token, params.userId, {
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        email: form.get('email'),
        phoneNumber: form.get('phoneNumber'),
        city: form.get('city'),
        country: form.get('country'),
        userType: form.get('userType')
      });
      setProfile(result.profile);
    } catch (saveError) {
      setError(saveError.message || 'Unable to update user.');
    }
  }

  if (!profile) {
    return <Card title="Edit user">Loading user...</Card>;
  }

  return (
    <Card
      title={`Edit ${profile.username}`}
      subtitle="Administrative profile modifications"
      actions={<StatusBadge status={profile.status} />}
    >
      <form className="grid-2" onSubmit={save}>
        <div><Label>First name</Label><Input name="firstName" defaultValue={profile.firstName} /></div>
        <div><Label>Last name</Label><Input name="lastName" defaultValue={profile.lastName} /></div>
        <div><Label>Email</Label><Input name="email" type="email" defaultValue={profile.email} /></div>
        <div><Label>Phone</Label><Input name="phoneNumber" defaultValue={profile.phoneNumber} /></div>
        <div><Label>City</Label><Input name="city" defaultValue={profile.city} /></div>
        <div><Label>Country</Label><Input name="country" defaultValue={profile.country} /></div>
        <div>
          <Label>User type</Label>
          <Select name="userType" defaultValue={profile.userType || 'customer'}>
            <option value="customer">customer</option>
            <option value="internal">internal</option>
          </Select>
        </div>

        <div style={{ gridColumn: '1 / -1' }} className="inline-actions">
          <Button type="submit">Save updates</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/users')}>Back to users</Button>
        </div>
      </form>

      {error ? <div className="notice" style={{ color: 'var(--danger)', marginTop: 14 }}>{error}</div> : null}
    </Card>
  );
}
