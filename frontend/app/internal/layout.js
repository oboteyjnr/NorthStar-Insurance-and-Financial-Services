'use client';

import PortalLayout from '../../components/PortalLayout';

const links = [
  { href: '/internal', label: 'Dashboard' },
  { href: '/profile', label: 'My Profile' },
  { href: '/internal/policies', label: 'Policy management' },
  { href: '/internal/amendments', label: 'Amendments' },
  { href: '/internal/reductions', label: 'Reductions' },
  { href: '/internal/claims', label: 'Claims' },
  { href: '/internal/support', label: 'Customer support' }
];

export default function InternalLayout({ children }) {
  return <PortalLayout title="Internal Operations" allowedRoles={['insurance-agent', 'underwriter', 'claims-adjuster', 'customer-service', 'compliance-officer', 'admin']} links={links}>{children}</PortalLayout>;
}
