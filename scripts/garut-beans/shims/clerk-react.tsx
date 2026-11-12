// Stand-in for @clerk/react while Garut Beans runs inside the NEMPO site.
// Buyer accounts (points & vouchers synced to a server) are not connected yet,
// so every visitor is a guest and the sign-in pages explain that honestly.
import type { ReactNode } from 'react';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function ClerkProvider({ children }: { children?: ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}

function AccountSoon() {
  return (
    <div style={{ padding: 24, borderRadius: 18, background: '#fff', border: '1px solid rgba(60,40,20,.12)', maxWidth: 420 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Akun pembeli segera hadir</h2>
      <p style={{ margin: '0 0 16px', lineHeight: 1.6, opacity: 0.8 }}>
        Untuk sementara kamu bisa menjelajah katalog, menyimpan favorit, dan mengisi keranjang tanpa akun.
        Penyimpanan poin dan voucher ke akun sedang kami siapkan.
      </p>
      <a href={`${base}/`} style={{ display: 'inline-block', padding: '10px 18px', borderRadius: 999, background: '#3b2416', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
        Kembali ke beranda
      </a>
    </div>
  );
}

export function SignIn(_props: Record<string, unknown>) {
  return <AccountSoon />;
}

export function SignUp(_props: Record<string, unknown>) {
  return <AccountSoon />;
}

const guestAuth = {
  isLoaded: true,
  isSignedIn: false as boolean,
  userId: null as string | null,
  sessionId: null as string | null,
  getToken: async () => null as string | null,
  signOut: async () => {},
};

export function useAuth() {
  return guestAuth;
}

export function useUser() {
  return { isLoaded: true, isSignedIn: false, user: null as null | { fullName?: string; primaryEmailAddress?: { emailAddress?: string } } };
}

export function useClerk() {
  return { signOut: async () => {}, openSignIn: () => {}, openSignUp: () => {} };
}
