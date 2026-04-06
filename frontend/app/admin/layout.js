'use client';

import PortalLayout from '../../components/PortalLayout';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/roles', label: 'Roles' }
];

export default function AdminLayout({ children }) {
  return <PortalLayout title="Admin Management" allowedRoles={['admin']} links={links}>{children}</PortalLayout>;
}
