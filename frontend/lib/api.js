const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:3443/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const fullUrl = `${API_BASE_URL}${path}`;
  console.log(`[API] ${method} ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    console.log(`[API] Response status: ${response.status}`);
    
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = payload.message || `HTTP ${response.status}`;
      console.error(`[API] Error: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    console.log(`[API] Success`);
    return payload;
  } catch (error) {
    console.error(`[API] Failed: ${error.message}`);
    if (error instanceof TypeError) {
      console.error('[API] TypeError - likely CORS or network issue:', error);
      throw new Error(`Cannot reach API at ${API_BASE_URL}. Make sure backend is running.`);
    }
    throw error;
  }
}

export function login(username, password) {
  return request('/auth/login', { method: 'POST', body: { username, password } });
}

export function getMe(token) {
  return request('/auth/me', { token });
}

export function getMyProfile(token) {
  return request('/profile/me', { token });
}

export function updateMyProfile(token, body) {
  return request('/profile/me', { method: 'PATCH', token, body });
}

export function listUsers(token) {
  return request('/admin/users', { token });
}

export function getUser(token, userId) {
  return request(`/admin/users/${userId}`, { token });
}

export function createUser(token, body) {
  return request('/admin/users', { method: 'POST', token, body });
}

export function updateUser(token, userId, body) {
  return request(`/admin/users/${userId}`, { method: 'PATCH', token, body });
}

export function toggleUserStatus(token, userId, status) {
  return request(`/admin/users/${userId}/status`, { method: 'PATCH', token, body: { status } });
}

export function listRoles(token) {
  return request('/admin/roles', { token });
}

export function assignRole(token, userId, role) {
  return request(`/admin/users/${userId}/roles`, { method: 'POST', token, body: { role } });
}

export function removeRole(token, userId, role) {
  return request(`/admin/users/${userId}/roles/${encodeURIComponent(role)}`, { method: 'DELETE', token });
}

export function listPolicies(token) {
  return request('/policies', { token });
}

export function createPolicy(token, body) {
  return request('/policies', { method: 'POST', token, body });
}

export function getPolicy(token, policyId) {
  return request(`/policies/${policyId}`, { token });
}

export function listAmendments(token) {
  return request('/amendments', { token });
}

export function createAmendment(token, body) {
  return request('/amendments', { method: 'POST', token, body });
}

export function reviewAmendment(token, amendmentId, body) {
  return request(`/amendments/${amendmentId}/review`, { method: 'PATCH', token, body });
}

export function listReductions(token) {
  return request('/reductions', { token });
}

export function createReduction(token, body) {
  return request('/reductions', { method: 'POST', token, body });
}

export function reviewReduction(token, reductionId, body) {
  return request(`/reductions/${reductionId}/review`, { method: 'PATCH', token, body });
}

export function listClaims(token) {
  return request('/claims', { token });
}

export function createClaim(token, body) {
  return request('/claims', { method: 'POST', token, body });
}

export function reviewClaim(token, claimId, body) {
  return request(`/claims/${claimId}/review`, { method: 'PATCH', token, body });
}

export function resolveHomeRoute(user) {
  if (!user) {
    return '/login';
  }

  if (user.roles?.includes('admin')) {
    return '/admin';
  }

  if (user.roles?.some((role) => ['insurance-agent', 'underwriter', 'claims-adjuster', 'customer-service', 'compliance-officer'].includes(role))) {
    return '/internal';
  }

  return '/customer';
}
