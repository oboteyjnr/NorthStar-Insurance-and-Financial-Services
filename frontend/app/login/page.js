'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, resolveHomeRoute } from '../../lib/api';
import { useAuth } from '../providers';
import { Button, Card, Input, Label } from '../../components/Ui';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [username, setUsername] = useState('customer1');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login attempt with username:', username);
      console.log('API base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
      
      const result = await login(username, password);
      console.log('Login successful, result:', result);
      
      auth.login(result.token, result.user);
      const homeRoute = resolveHomeRoute(result.user);
      console.log('Redirecting to:', homeRoute);
      router.push(homeRoute);
    } catch (loginError) {
      console.error('Login error:', loginError);
      setError(loginError.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div style={{ width: 'min(600px, 100%)', display: 'grid', gap: 24 }}>
        <Card title="Secure Sign In" subtitle="JWT-authenticated access">
          <form className="field-grid" onSubmit={handleSubmit}>
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(event) => setUsername(event.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error ? <div className="notice" style={{ color: 'var(--danger)' }}>{error}</div> : null}
            <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          </form>

          <div className="notice" style={{ marginTop: 16, fontSize: '0.9rem' }}>
            <strong>Demo credentials:</strong> customer1 / Password123!
          </div>
        </Card>

        <div className="grid-2">
          <Card title="Customer Portal" subtitle="Guest access">
            <p className="copy" style={{ marginBottom: 12 }}>Sign in as a customer to view your policies, submit claims, and request amendments.</p>
            <Button onClick={() => { setUsername('customer1'); setPassword('Password123!'); }} variant="secondary">Load demo</Button>
          </Card>

          <Card title="Internal Portal" subtitle="Staff access">
            <p className="copy" style={{ marginBottom: 12 }}>Sign in as agent1 (Agent), underwriter1, adjuster1, or csr1 to review and process requests.</p>
            <Button onClick={() => { setUsername('agent1'); setPassword('Password123!'); }} variant="secondary">Load agent demo</Button>
          </Card>

          <Card title="Admin Portal" subtitle="Administrator access">
            <p className="copy" style={{ marginBottom: 12 }}>Sign in as admin1 to manage users, assign roles, and control RBAC.</p>
            <Button onClick={() => { setUsername('admin1'); setPassword('Password123!'); }} variant="secondary">Load admin demo</Button>
          </Card>

          <Card title="Test Coverage" subtitle="All roles included">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>✓ Customer (customer1, customer2)</li>
              <li>✓ Agent (agent1)</li>
              <li>✓ Underwriter (underwriter1)</li>
              <li>✓ Claims Adjuster (adjuster1)</li>
              <li>✓ CSR (csr1)</li>
              <li>✓ Compliance (compliance1)</li>
              <li>✓ Admin (admin1)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
