export function Footer() {
  const year = new Date().getFullYear();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Premium Picks';

  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-6 lg:px-8">
        <p>© {year} {siteName}. All rights reserved.</p>
        <p className="mt-1 text-xs">
          As an affiliate, we may earn from qualifying purchases.
        </p>
      </div>
    </footer>
  );
}
