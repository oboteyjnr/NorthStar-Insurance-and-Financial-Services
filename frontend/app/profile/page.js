'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import { getMyProfile, suspendMyProfile } from '../../lib/api';
import { Badge, Button, Card, StatusBadge } from '../../components/Ui';

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }

    getMyProfile(token)
      .then((result) => setProfile(result.profile))
      .catch((loadError) => setError(loadError.message || 'Unable to load profile.'));
  }, [token]);

  async function handleSelfSuspend() {
    setError('');
    setSuccess('');

    const confirmed = window.confirm('Are you sure you want to suspend your own account? You will be signed out immediately.');
    if (!confirmed) {
      return;
    }

    try {
      await suspendMyProfile(token);
      setSuccess('Your account has been suspended. Signing out...');
      setTimeout(() => logout(), 900);
    } catch (suspendError) {
      setError(suspendError.message || 'Unable to suspend account.');
    }
  }

  if (!profile) {
    return <Card title="My profile">Loading profile...</Card>;
  }

  const isAdmin = (profile.roles || []).includes('admin');

  return (
    <Card
      title="Profile details"
      subtitle="Secure self-service profile and account view"
      actions={<Link className="button-secondary" href="/profile/edit">Edit profile</Link>}
    >
      <div className="grid-2">
        <div className="kpi"><span>Username</span><strong>{profile.username}</strong></div>
        <div className="kpi"><span>Full name</span><strong>{profile.firstName} {profile.lastName}</strong></div>
        <div className="kpi"><span>Email</span><strong>{profile.email || '-'}</strong></div>
        <div className="kpi"><span>Phone</span><strong>{profile.phoneNumber || '-'}</strong></div>
        <div className="kpi"><span>User type</span><strong>{profile.userType || '-'}</strong></div>
        <div className="kpi"><span>City</span><strong>{profile.city || '-'}</strong></div>
        <div className="kpi"><span>Country</span><strong>{profile.country || '-'}</strong></div>
        <div className="kpi"><span>Account status</span><StatusBadge status={profile.status} /></div>
      </div>

      <div className="inline-actions" style={{ marginTop: 18 }}>
        {(profile.roles || []).map((role) => <Badge key={role}>{role}</Badge>)}
      </div>

      {!isAdmin ? (
        <div className="stack" style={{ marginTop: 18 }}>
          <div className="notice">You can suspend your account from here. Reactivation must be done by an administrator.</div>
          <div>
            <Button variant="danger" onClick={handleSelfSuspend}>Suspend my account</Button>
          </div>
        </div>
      ) : null}

      {error ? <div className="notice" style={{ color: 'var(--danger)', marginTop: 14 }}>{error}</div> : null}
      {success ? <div className="notice" style={{ color: 'var(--success)', marginTop: 14 }}>{success}</div> : null}
    </Card>
  );
}
