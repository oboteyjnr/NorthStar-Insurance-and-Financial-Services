'use client';

import PortalLayout from '../../components/PortalLayout';

const allRoles = [
  'customer',
  'insurance-agent',
  'underwriter',
  'claims-adjuster',
  'customer-service',
  'compliance-officer',
  'admin'
];

const links = [
  { href: '/profile', label: 'My Profile' },
  { href: '/profile/edit', label: 'Edit Profile' }
];

export default function ProfileLayout({ children }) {
  return <PortalLayout title="My Profile" allowedRoles={allRoles} links={links}>{children}</PortalLayout>;
}
