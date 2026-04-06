'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import { getMyProfile, updateMyProfile } from '../../../lib/api';
import { Card, Button, Input, Label } from '../../../components/Ui';

export default function CustomerProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    getMyProfile(token).then((result) => setProfile(result.profile));
  }, [token]);

  async function save(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated = await updateMyProfile(token, {
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      email: form.get('email'),
      phoneNumber: form.get('phoneNumber'),
      addressLine1: form.get('addressLine1'),
      city: form.get('city'),
      provinceOrState: form.get('provinceOrState'),
      postalCode: form.get('postalCode'),
      preferredContactMethod: form.get('preferredContactMethod')
    });
    setProfile(updated.profile);
  }

  if (!profile) {
    return <Card title="Profile">Loading...</Card>;
  }

  return (
    <Card title="My profile" subtitle="Editable personal fields only">
      <form className="grid-2" onSubmit={save}>
        <div><Label>First name</Label><Input name="firstName" defaultValue={profile.firstName} /></div>
        <div><Label>Last name</Label><Input name="lastName" defaultValue={profile.lastName} /></div>
        <div><Label>Email</Label><Input name="email" defaultValue={profile.email} /></div>
        <div><Label>Phone number</Label><Input name="phoneNumber" defaultValue={profile.phoneNumber} /></div>
        <div><Label>Address line 1</Label><Input name="addressLine1" defaultValue={profile.addressLine1} /></div>
        <div><Label>City</Label><Input name="city" defaultValue={profile.city} /></div>
        <div><Label>Province or state</Label><Input name="provinceOrState" defaultValue={profile.provinceOrState} /></div>
        <div><Label>Postal code</Label><Input name="postalCode" defaultValue={profile.postalCode} /></div>
        <div><Label>Preferred contact method</Label><Input name="preferredContactMethod" defaultValue={profile.preferredContactMethod} /></div>
        <div style={{ gridColumn: '1 / -1' }}><Button type="submit">Save changes</Button></div>
      </form>
    </Card>
  );
}
