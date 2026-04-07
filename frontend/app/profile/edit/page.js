'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers';
import { getMyProfile, updateMyProfile } from '../../../lib/api';
import { Button, Card, Input, Label } from '../../../components/Ui';

export default function ProfileEditPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    getMyProfile(token)
      .then((result) => setProfile(result.profile))
      .catch(() => setErrors({ general: 'Unable to load profile details.' }));
  }, [token]);

  function validate(values) {
    const nextErrors = {};

    if (!values.firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    }

    if (!values.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '')) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (values.phoneNumber && !/^[+()\-\s0-9]{7,20}$/.test(values.phoneNumber)) {
      nextErrors.phoneNumber = 'Enter a valid phone number.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setFeedback('');

    const form = new FormData(event.currentTarget);
    const values = {
      firstName: String(form.get('firstName') || ''),
      lastName: String(form.get('lastName') || ''),
      email: String(form.get('email') || ''),
      phoneNumber: String(form.get('phoneNumber') || ''),
      city: String(form.get('city') || ''),
      country: String(form.get('country') || '')
    };

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await updateMyProfile(token, values);
      setFeedback('Profile updated successfully. Redirecting...');
      setTimeout(() => router.push('/profile'), 900);
    } catch (submitError) {
      setErrors({ general: submitError.message || 'Unable to update profile.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (!profile) {
    return <Card title="Edit profile">Loading form...</Card>;
  }

  return (
    <Card title="Edit your profile" subtitle="Roles and account status are managed by administration only">
      <form className="grid-2" onSubmit={handleSubmit} noValidate>
        <div>
          <Label>First name</Label>
          <Input name="firstName" defaultValue={profile.firstName} />
          {errors.firstName ? <div className="caption" style={{ color: 'var(--danger)' }}>{errors.firstName}</div> : null}
        </div>
        <div>
          <Label>Last name</Label>
          <Input name="lastName" defaultValue={profile.lastName} />
          {errors.lastName ? <div className="caption" style={{ color: 'var(--danger)' }}>{errors.lastName}</div> : null}
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" type="email" defaultValue={profile.email} />
          {errors.email ? <div className="caption" style={{ color: 'var(--danger)' }}>{errors.email}</div> : null}
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phoneNumber" defaultValue={profile.phoneNumber} />
          {errors.phoneNumber ? <div className="caption" style={{ color: 'var(--danger)' }}>{errors.phoneNumber}</div> : null}
        </div>
        <div>
          <Label>City</Label>
          <Input name="city" defaultValue={profile.city} />
        </div>
        <div>
          <Label>Country</Label>
          <Input name="country" defaultValue={profile.country} />
        </div>
        <div style={{ gridColumn: '1 / -1' }} className="inline-actions">
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save profile'}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/profile')}>Cancel</Button>
        </div>
      </form>

      {errors.general ? <div className="notice" style={{ color: 'var(--danger)', marginTop: 14 }}>{errors.general}</div> : null}
      {feedback ? <div className="notice" style={{ color: 'var(--success)', marginTop: 14 }}>{feedback}</div> : null}
    </Card>
  );
}
