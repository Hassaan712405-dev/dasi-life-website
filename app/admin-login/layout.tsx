export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple pass-through layout — no admin check
  // Admin login page ka apna check hai
  return <>{children}</>;
}