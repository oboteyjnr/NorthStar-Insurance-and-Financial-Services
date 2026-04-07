'use client';

import PortalLayout from '../../components/PortalLayout';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/profile', label: 'My Profile' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/users/create', label: 'Create User' },
  { href: '/admin/account-status', label: 'Account Status' },
  { href: '/admin/rbac', label: 'RBAC' }
];

export default function AdminLayout({ children }) {
  return <PortalLayout title="Admin Management" allowedRoles={['admin']} links={links}>{children}</PortalLayout>;
}
