import './globals.css';
import { Space_Grotesk, Manrope } from 'next/font/google';
import { AuthProvider } from './providers';

const heading = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: 'NorthStar Insurance',
  description: 'Secure insurance lab platform for customers, staff, and administrators.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
