import { AdminThemeInit } from './AdminThemeInit';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return <AdminThemeInit>{children}</AdminThemeInit>;
}
