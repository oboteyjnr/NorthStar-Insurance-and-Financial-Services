'use client';

import PortalLayout from '../../components/PortalLayout';

const links = [
  { href: '/customer', label: 'Dashboard' },
  { href: '/profile', label: 'My Profile' },
  { href: '/customer/profile', label: 'Profile' },
  { href: '/customer/policies', label: 'My policies' },
  { href: '/customer/amendments', label: 'Amendments' },
  { href: '/customer/reductions', label: 'Reductions' },
  { href: '/customer/claims', label: 'Claims' }
];

export default function CustomerLayout({ children }) {
  return <PortalLayout title="Customer Portal" allowedRoles={['customer']} links={links}>{children}</PortalLayout>;
}
